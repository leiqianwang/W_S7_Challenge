package com.pizza.api.service;

import com.pizza.api.dto.ToppingResponse;
import com.pizza.api.model.Topping;
import com.pizza.api.repository.ToppingRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ToppingService {

    private final ToppingRepository toppingRepository;

    public ToppingService(ToppingRepository toppingRepository) {
        this.toppingRepository = toppingRepository;
    }

    @Transactional(readOnly = true)
    public List<ToppingResponse> findAll() {
        return toppingRepository.findAll().stream()
                .map(t -> new ToppingResponse(t.getId(), t.getName()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> resolveNames(List<Integer> toppingIds) {
        return toppingIds.stream()
                .map(id -> toppingRepository.findById(id)
                        .map(Topping::getName)
                        .orElse("Unknown"))
                .toList();
    }
}
