package com.pizza.api.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pizza_orders")
public class PizzaOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 1)
    private PizzaSize size;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "order_toppings", joinColumns = @JoinColumn(name = "order_id"))
    @Column(name = "topping_id", nullable = false)
    @OrderColumn(name = "position")
    private List<Integer> toppingIds = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status = OrderStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserAccount user;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    /** Last moment the customer may cancel or edit this order. */
    @Column(nullable = false)
    private Instant editableUntil;

    protected PizzaOrder() {
    }

    public PizzaOrder(String fullName, PizzaSize size, List<Integer> toppingIds, UserAccount user) {
        this.fullName = fullName;
        this.size = size;
        this.toppingIds = toppingIds != null ? new ArrayList<>(toppingIds) : new ArrayList<>();
        this.user = user;
        this.status = OrderStatus.ACTIVE;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        this.editableUntil = now.plusSeconds(size.getCancellationWindowMinutes() * 60L);
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public boolean isEditable(Instant now) {
        return status == OrderStatus.ACTIVE && !now.isAfter(editableUntil);
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public PizzaSize getSize() {
        return size;
    }

    public void setSize(PizzaSize size) {
        this.size = size;
    }

    public List<Integer> getToppingIds() {
        return toppingIds;
    }

    public void setToppingIds(List<Integer> toppingIds) {
        this.toppingIds = toppingIds != null ? new ArrayList<>(toppingIds) : new ArrayList<>();
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public UserAccount getUser() {
        return user;
    }

    public void setUser(UserAccount user) {
        this.user = user;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Instant getEditableUntil() {
        return editableUntil;
    }

    /** Recalculate cancel/edit deadline after a size change (while still editable). */
    public void refreshEditableUntilFromNow() {
        this.editableUntil = Instant.now().plusSeconds(size.getCancellationWindowMinutes() * 60L);
    }
}
