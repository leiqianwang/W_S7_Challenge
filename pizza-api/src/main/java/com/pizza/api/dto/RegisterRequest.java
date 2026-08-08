package com.pizza.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "username is required")
    @Size(min = 3, max = 40, message = "username must be 3-40 characters")
    private String username;

    @NotBlank(message = "password is required")
    @Size(min = 4, max = 64, message = "password must be 4-64 characters")
    private String password;

    @NotBlank(message = "displayName is required")
    @Size(min = 2, max = 40, message = "displayName must be 2-40 characters")
    private String displayName;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
