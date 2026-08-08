package com.pizza.api.dto;

import java.time.Instant;

public class UserResponse {

    private Long id;
    private String username;
    private String displayName;
    private Instant createdAt;
    private String message;

    public UserResponse() {
    }

    public UserResponse(Long id, String username, String displayName, Instant createdAt, String message) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.createdAt = createdAt;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
