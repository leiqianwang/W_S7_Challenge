package com.pizza.api.service;

import com.pizza.api.dto.OrderDetailResponse;
import com.pizza.api.dto.OrderRequest;
import com.pizza.api.dto.OrderSubmitResponse;
import com.pizza.api.exception.ApiException;
import com.pizza.api.model.OrderStatus;
import com.pizza.api.model.PizzaOrder;
import com.pizza.api.model.PizzaSize;
import com.pizza.api.model.UserAccount;
import com.pizza.api.repository.PizzaOrderRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private static final String FULL_NAME_REQUIRED = "fullName is required";
    private static final String FULL_NAME_MIN = "fullName must be at least 3 characters";
    private static final String FULL_NAME_MAX = "fullName cannot exceed 20 characters";
    private static final String SIZE_REQUIRED = "size is required";
    private static final String SIZE_OPTIONS = "size must be one of the following values: S, M, L";
    private static final String TOPPINGS_TYPE = "toppings must be an array of IDs";
    private static final String TOPPING_INVALID = "topping ID invalid";
    private static final String TOPPING_REPEATED = "topping IDs cannot be repeated";

    private final PizzaOrderRepository pizzaOrderRepository;
    private final ToppingService toppingService;
    private final UserService userService;

    public OrderService(PizzaOrderRepository pizzaOrderRepository,
                        ToppingService toppingService,
                        UserService userService) {
        this.pizzaOrderRepository = pizzaOrderRepository;
        this.toppingService = toppingService;
        this.userService = userService;
    }

    /**
     * Creates an order and returns the helpers.js-compatible success payload (HTTP 201).
     */
    @Transactional
    public OrderSubmitResponse createOrder(OrderRequest request) {
        ValidatedOrder validated = validate(request);
        UserAccount user = resolveUser(request.getUserId());

        PizzaOrder order = new PizzaOrder(
                validated.fullName(),
                validated.size(),
                validated.toppingIds(),
                user
        );
        pizzaOrderRepository.save(order);

        List<String> toppingNames = toppingService.resolveNames(validated.toppingIds());
        return OrderSubmitResponse.success(
                validated.fullName(),
                validated.size().getLabel(),
                validated.size().name(),
                toppingNames
        );
    }

    @Transactional(readOnly = true)
    public OrderDetailResponse getById(Long id) {
        return toDetail(requireOrder(id));
    }

    @Transactional(readOnly = true)
    public List<OrderDetailResponse> listAll() {
        return pizzaOrderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDetail)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderDetailResponse> listActiveForUser(Long userId) {
        userService.requireUser(userId);
        return pizzaOrderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, OrderStatus.ACTIVE).stream()
                .map(this::toDetail)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderDetailResponse> listHistoryForUser(Long userId) {
        userService.requireUser(userId);
        return pizzaOrderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(o -> o.getStatus() != OrderStatus.ACTIVE)
                .map(this::toDetail)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderDetailResponse> listAllForUser(Long userId) {
        userService.requireUser(userId);
        return pizzaOrderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDetail)
                .toList();
    }

    /**
     * Updates an ACTIVE order only while within the size-based cancel/edit window.
     */
    @Transactional
    public OrderDetailResponse updateOrder(Long id, OrderRequest request) {
        PizzaOrder order = requireOrder(id);
        assertEditable(order);

        ValidatedOrder validated = validate(request);
        order.setFullName(validated.fullName());
        boolean sizeChanged = order.getSize() != validated.size();
        order.setSize(validated.size());
        order.setToppingIds(validated.toppingIds());
        if (sizeChanged) {
            order.refreshEditableUntilFromNow();
        }

        if (request.getUserId() != null && order.getUser() == null) {
            order.setUser(userService.requireUser(request.getUserId()));
        }

        pizzaOrderRepository.save(order);
        OrderDetailResponse response = toDetail(order);
        response.setMessage("Order updated successfully");
        return response;
    }

    /**
     * Soft-cancels (status CANCELLED) within the editable window. Outside the window → 403.
     */
    @Transactional
    public OrderDetailResponse cancelOrder(Long id) {
        PizzaOrder order = requireOrder(id);

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new ApiException(HttpStatus.CONFLICT.value(), "Order is already cancelled");
        }
        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new ApiException(HttpStatus.CONFLICT.value(), "Completed orders cannot be cancelled");
        }

        assertEditable(order);
        order.setStatus(OrderStatus.CANCELLED);
        pizzaOrderRepository.save(order);

        OrderDetailResponse response = toDetail(order);
        response.setMessage("Order cancelled successfully");
        return response;
    }

    @Transactional
    public OrderDetailResponse completeOrder(Long id) {
        PizzaOrder order = requireOrder(id);
        if (order.getStatus() != OrderStatus.ACTIVE) {
            throw new ApiException(HttpStatus.CONFLICT.value(),
                    "Only active orders can be marked completed");
        }
        order.setStatus(OrderStatus.COMPLETED);
        pizzaOrderRepository.save(order);

        OrderDetailResponse response = toDetail(order);
        response.setMessage("Order marked completed");
        return response;
    }

    private PizzaOrder requireOrder(Long id) {
        return pizzaOrderRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Order not found"));
    }

    private void assertEditable(PizzaOrder order) {
        Instant now = Instant.now();
        if (!order.isEditable(now)) {
            int minutes = order.getSize().getCancellationWindowMinutes();
            throw new ApiException(HttpStatus.FORBIDDEN.value(),
                    "Order can no longer be changed. Cancellation/edit window is "
                            + minutes + " minutes after placement for size " + order.getSize().name() + ".");
        }
    }

    private UserAccount resolveUser(Long userId) {
        if (userId == null) {
            return null;
        }
        return userService.requireUser(userId);
    }

    private ValidatedOrder validate(OrderRequest request) {
        if (request == null) {
            throw new ApiException(422, FULL_NAME_REQUIRED);
        }

        if (request.getFullName() == null) {
            throw new ApiException(422, FULL_NAME_REQUIRED);
        }

        String fullName = request.getFullName().trim();
        if (fullName.isEmpty()) {
            throw new ApiException(422, FULL_NAME_REQUIRED);
        }
        if (fullName.length() < 3) {
            throw new ApiException(422, FULL_NAME_MIN);
        }
        if (fullName.length() > 20) {
            throw new ApiException(422, FULL_NAME_MAX);
        }

        String sizeRaw = request.getSize();
        if (sizeRaw == null || sizeRaw.isBlank()) {
            throw new ApiException(422, SIZE_REQUIRED);
        }
        PizzaSize size;
        try {
            size = PizzaSize.fromCode(sizeRaw);
        } catch (IllegalArgumentException ex) {
            throw new ApiException(422, SIZE_OPTIONS);
        }

        List<Integer> toppingIds = parseToppings(request.getToppings());
        return new ValidatedOrder(fullName, size, toppingIds);
    }

    private List<Integer> parseToppings(List<Object> toppings) {
        if (toppings == null) {
            return List.of();
        }
        if (!(toppings instanceof List<?>)) {
            throw new ApiException(422, TOPPINGS_TYPE);
        }

        List<Integer> ids = new ArrayList<>();
        Set<Integer> seen = new HashSet<>();

        for (Object item : toppings) {
            Integer id = toToppingId(item);
            if (id < 1 || id > 5) {
                throw new ApiException(422, TOPPING_INVALID);
            }
            if (!seen.add(id)) {
                throw new ApiException(422, TOPPING_REPEATED);
            }
            ids.add(id);
        }
        return ids;
    }

    private Integer toToppingId(Object item) {
        if (item == null) {
            throw new ApiException(422, TOPPINGS_TYPE);
        }
        if (item instanceof Number number) {
            return number.intValue();
        }
        if (item instanceof String str) {
            try {
                return Integer.parseInt(str.trim());
            } catch (NumberFormatException ex) {
                throw new ApiException(422, TOPPINGS_TYPE);
            }
        }
        throw new ApiException(422, TOPPINGS_TYPE);
    }

    private OrderDetailResponse toDetail(PizzaOrder order) {
        Instant now = Instant.now();
        List<String> names = toppingService.resolveNames(order.getToppingIds());

        OrderDetailResponse response = new OrderDetailResponse();
        response.setId(order.getId());
        response.setFullName(order.getFullName());
        response.setSize(order.getSize().name());
        response.setToppingIds(List.copyOf(order.getToppingIds()));
        response.setToppings(names);
        response.setStatus(order.getStatus());
        response.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        response.setEditableUntil(order.getEditableUntil());
        response.setEditable(order.isEditable(now));
        response.setCancellationWindowMinutes(order.getSize().getCancellationWindowMinutes());
        return response;
    }

    private record ValidatedOrder(String fullName, PizzaSize size, List<Integer> toppingIds) {
    }
}
