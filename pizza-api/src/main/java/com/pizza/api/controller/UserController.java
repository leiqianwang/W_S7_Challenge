package com.pizza.api.controller;

import com.pizza.api.dto.OrderDetailResponse;
import com.pizza.api.dto.UserResponse;
import com.pizza.api.service.OrderService;
import com.pizza.api.service.UserService;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Logged-in home page aggregate: profile + active orders + history.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3003", "http://localhost:3000", "http://127.0.0.1:3003"})
public class UserController {

    private final UserService userService;
    private final OrderService orderService;

    public UserController(UserService userService, OrderService orderService) {
        this.userService = userService;
        this.orderService = orderService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<Map<String, Object>> getOrderDashboard(@PathVariable Long id) {
        UserResponse user = userService.getById(id);
        List<OrderDetailResponse> active = orderService.listActiveForUser(id);
        List<OrderDetailResponse> history = orderService.listHistoryForUser(id);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("user", user);
        body.put("activeOrders", active);
        body.put("orderHistory", history);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{id}/orders/active")
    public ResponseEntity<List<OrderDetailResponse>> getActiveOrders(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.listActiveForUser(id));
    }

    @GetMapping("/{id}/orders/history")
    public ResponseEntity<List<OrderDetailResponse>> getOrderHistory(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.listHistoryForUser(id));
    }
}
