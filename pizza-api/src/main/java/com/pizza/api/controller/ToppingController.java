package com.pizza.api.controller;

import com.pizza.api.dto.ToppingResponse;
import com.pizza.api.service.ToppingService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/toppings")
@CrossOrigin(origins = {"http://localhost:3003", "http://localhost:3000", "http://127.0.0.1:3003"})
public class ToppingController {

    private final ToppingService toppingService;

    public ToppingController(ToppingService toppingService) {
        this.toppingService = toppingService;
    }

    @GetMapping
    public ResponseEntity<List<ToppingResponse>> list() {
        return ResponseEntity.ok(toppingService.findAll());
    }
}
