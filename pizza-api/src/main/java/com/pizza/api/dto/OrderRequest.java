package com.pizza.api.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Request body matching Form.js / helpers.js:
 * { "fullName": "...", "size": "S|M|L", "toppings": [1,"2",...] , "userId": optional }
 * Validation is performed in OrderService to mirror helpers.js messages (HTTP 422).
 */
public class OrderRequest {

    private String fullName;
    private String size;
    private List<Object> toppings = new ArrayList<>();
    private Long userId;

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

    public List<Object> getToppings() {
        return toppings;
    }

    public void setToppings(List<Object> toppings) {
        this.toppings = toppings != null ? toppings : new ArrayList<>();
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
