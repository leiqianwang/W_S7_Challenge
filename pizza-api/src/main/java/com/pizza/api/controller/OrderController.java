package com.pizza.api.controller;

import com.pizza.api.dto.OrderDetailResponse;
import com.pizza.api.dto.OrderRequest;
import com.pizza.api.dto.OrderSubmitResponse;
import com.pizza.api.service.OrderService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Pizza order REST mappings. Primary create path mirrors Express:
 * POST /api/order  →  helpers.js postPizza response shape.
 */
@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = {"http://localhost:3003", "http://localhost:3000", "http://127.0.0.1:3003"})
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /** Create a new pizza order (Form.js submit). */
    @PostMapping
    public ResponseEntity<OrderSubmitResponse> create(@RequestBody OrderRequest request) {
        OrderSubmitResponse body = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    /**
     * List orders.
     * <ul>
     *   <li>GET /api/order — all orders</li>
     *   <li>GET /api/order?userId=1 — that user's orders</li>
     *   <li>GET /api/order?userId=1&amp;status=active|history — filtered for home page</li>
     * </ul>
     */
    @GetMapping
    public ResponseEntity<List<OrderDetailResponse>> list(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String status) {

        if (userId == null) {
            return ResponseEntity.ok(orderService.listAll());
        }

        if (status == null || status.isBlank()) {
            return ResponseEntity.ok(orderService.listAllForUser(userId));
        }

        return switch (status.trim().toLowerCase()) {
            case "active" -> ResponseEntity.ok(orderService.listActiveForUser(userId));
            case "history", "past" -> ResponseEntity.ok(orderService.listHistoryForUser(userId));
            default -> ResponseEntity.ok(orderService.listAllForUser(userId));
        };
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    /** Edit an existing order within the cancel/edit time window. */
    @PutMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> update(@PathVariable Long id,
                                                      @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.updateOrder(id, request));
    }

    /** Cancel (soft-delete) within the size-based time window. */
    @DeleteMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }

    /** Mark order completed (moves into history for the user home page). */
    @PostMapping("/{id}/complete")
    public ResponseEntity<OrderDetailResponse> complete(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.completeOrder(id));
    }
}
