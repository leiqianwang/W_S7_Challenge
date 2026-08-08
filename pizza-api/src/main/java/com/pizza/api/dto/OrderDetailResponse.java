package com.pizza.api.dto;

import com.pizza.api.model.OrderStatus;
import java.time.Instant;
import java.util.List;

public class OrderDetailResponse {

    private Long id;
    private String fullName;
    private String size;
    private List<Integer> toppingIds;
    private List<String> toppings;
    private OrderStatus status;
    private Long userId;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant editableUntil;
    private boolean editable;
    private int cancellationWindowMinutes;
    private String message;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public List<Integer> getToppingIds() {
        return toppingIds;
    }

    public void setToppingIds(List<Integer> toppingIds) {
        this.toppingIds = toppingIds;
    }

    public List<String> getToppings() {
        return toppings;
    }

    public void setToppings(List<String> toppings) {
        this.toppings = toppings;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getEditableUntil() {
        return editableUntil;
    }

    public void setEditableUntil(Instant editableUntil) {
        this.editableUntil = editableUntil;
    }

    public boolean isEditable() {
        return editable;
    }

    public void setEditable(boolean editable) {
        this.editable = editable;
    }

    public int getCancellationWindowMinutes() {
        return cancellationWindowMinutes;
    }

    public void setCancellationWindowMinutes(int cancellationWindowMinutes) {
        this.cancellationWindowMinutes = cancellationWindowMinutes;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
