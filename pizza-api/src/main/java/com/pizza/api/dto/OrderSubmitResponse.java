package com.pizza.api.dto;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Matches helpers.js postPizza success/error JSON shape used by Form.js.
 */
public class OrderSubmitResponse {

    private String message;
    private Map<String, Object> data;

    public OrderSubmitResponse() {
    }

    public OrderSubmitResponse(String message, Map<String, Object> data) {
        this.message = message;
        this.data = data;
    }

    public static OrderSubmitResponse success(String fullName, String sizeLabel, String sizeCode,
                                              List<String> toppingNames) {
        int count = toppingNames == null ? 0 : toppingNames.size();
        String toppingWord = count == 1 ? "topping" : "toppings";
        String toppingPart = count == 0 ? "no" : String.valueOf(count);

        String message = "Thank you for your order, " + fullName + "! Your " + sizeLabel
                + " pizza with " + toppingPart + " " + toppingWord + " is on the way.";

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("size", sizeCode);
        data.put("customer", fullName);
        if (count > 0) {
            data.put("toppings", toppingNames);
        }
        return new OrderSubmitResponse(message, data);
    }

    public static OrderSubmitResponse error(String message) {
        return new OrderSubmitResponse(message, null);
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }
}
