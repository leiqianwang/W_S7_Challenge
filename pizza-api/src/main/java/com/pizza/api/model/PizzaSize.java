package com.pizza.api.model;

/**
 * Pizza size codes used by the React form and helpers.js mock API.
 * Cancellation windows differ by size (small prep finishes sooner).
 */
public enum PizzaSize {
    S("small", 10),
    M("medium", 15),
    L("large", 20);

    private final String label;
    private final int cancellationWindowMinutes;

    PizzaSize(String label, int cancellationWindowMinutes) {
        this.label = label;
        this.cancellationWindowMinutes = cancellationWindowMinutes;
    }

    public String getLabel() {
        return label;
    }

    public int getCancellationWindowMinutes() {
        return cancellationWindowMinutes;
    }

    public static PizzaSize fromCode(String code) {
        if (code == null) {
            throw new IllegalArgumentException("size is required");
        }
        try {
            return PizzaSize.valueOf(code.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("size must be one of the following values: S, M, L");
        }
    }
}
