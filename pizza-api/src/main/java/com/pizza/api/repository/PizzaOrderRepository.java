package com.pizza.api.repository;

import com.pizza.api.model.OrderStatus;
import com.pizza.api.model.PizzaOrder;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PizzaOrderRepository extends JpaRepository<PizzaOrder, Long> {
    List<PizzaOrder> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<PizzaOrder> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, OrderStatus status);

    List<PizzaOrder> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    List<PizzaOrder> findAllByOrderByCreatedAtDesc();
}
