package com.pizza.api.repository;

import com.pizza.api.model.Topping;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToppingRepository extends JpaRepository<Topping, Integer> {
}
