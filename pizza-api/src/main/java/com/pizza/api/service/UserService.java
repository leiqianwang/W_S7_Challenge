package com.pizza.api.service;

import com.pizza.api.dto.LoginRequest;
import com.pizza.api.dto.RegisterRequest;
import com.pizza.api.dto.UserResponse;
import com.pizza.api.exception.ApiException;
import com.pizza.api.model.UserAccount;
import com.pizza.api.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserAccountRepository userAccountRepository;

    public UserService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String username = request.getUsername().trim();
        String displayName = request.getDisplayName().trim();

        if (userAccountRepository.existsByUsernameIgnoreCase(username)) {
            throw new ApiException(HttpStatus.CONFLICT.value(), "username already taken");
        }

        UserAccount user = new UserAccount(
                username,
                PasswordHasher.hash(request.getPassword()),
                displayName
        );
        user = userAccountRepository.save(user);
        return toResponse(user, "Account created successfully");
    }

    @Transactional(readOnly = true)
    public UserResponse login(LoginRequest request) {
        UserAccount user = userAccountRepository.findByUsernameIgnoreCase(request.getUsername().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED.value(), "Invalid username or password"));

        if (!PasswordHasher.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Invalid username or password");
        }
        return toResponse(user, "Login successful");
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        UserAccount user = userAccountRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "User not found"));
        return toResponse(user, null);
    }

    @Transactional(readOnly = true)
    public UserAccount requireUser(Long userId) {
        return userAccountRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "User not found"));
    }

    private UserResponse toResponse(UserAccount user, String message) {
        return new UserResponse(user.getId(), user.getUsername(), user.getDisplayName(), user.getCreatedAt(), message);
    }
}
