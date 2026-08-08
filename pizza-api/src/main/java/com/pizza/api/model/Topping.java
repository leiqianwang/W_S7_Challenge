package com.pizza.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "toppings")
public class Topping {

    @Id
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    protected Topping() {
    }

    public Topping(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
