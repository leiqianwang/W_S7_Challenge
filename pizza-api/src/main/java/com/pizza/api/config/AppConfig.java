package com.pizza.api.config;

import com.pizza.api.model.Topping;
import com.pizza.api.model.UserAccount;
import com.pizza.api.repository.ToppingRepository;
import com.pizza.api.repository.UserAccountRepository;
import com.pizza.api.service.PasswordHasher;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                                "http://localhost:3003",
                                "http://localhost:3000",
                                "http://127.0.0.1:3003"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    /** Seed toppings (same IDs as helpers.js) and a demo login account. */
    @Bean
    CommandLineRunner seedData(ToppingRepository toppingRepository,
                               UserAccountRepository userAccountRepository) {
        return args -> {
            if (toppingRepository.count() == 0) {
                toppingRepository.save(new Topping(1, "Pepperoni"));
                toppingRepository.save(new Topping(2, "Green Peppers"));
                toppingRepository.save(new Topping(3, "Pineapple"));
                toppingRepository.save(new Topping(4, "Mushrooms"));
                toppingRepository.save(new Topping(5, "Ham"));
            }

            if (!userAccountRepository.existsByUsernameIgnoreCase("demo")) {
                userAccountRepository.save(new UserAccount(
                        "demo",
                        PasswordHasher.hash("demo1234"),
                        "Demo User"
                ));
            }
        };
    }
}
