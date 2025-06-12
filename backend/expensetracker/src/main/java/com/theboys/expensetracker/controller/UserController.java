package com.theboys.expensetracker.controller;

import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.service.UserDetailsServiceImp;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {

   UserDetailsServiceImp userDetailsServiceImp;

    public UserController(UserDetailsServiceImp userService) {
        this.userDetailsServiceImp = userService;
    }

    @GetMapping("/admin/api/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userDetailsServiceImp.getAllUsers());
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello World");
    }

    @GetMapping("api/user/budget")
    public ResponseEntity<Double> getBudget(@AuthenticationPrincipal User user) {
        double budget = userDetailsServiceImp.getUserBudget(user);
        return ResponseEntity.ok(budget);
    }

    @GetMapping("api/user/money")
    public ResponseEntity<Double> getMoney(@AuthenticationPrincipal User user) {
        double money = userDetailsServiceImp.getUserMoney(user);
        return ResponseEntity.ok(money);
    }

    @PatchMapping("api/user/budget")
    public ResponseEntity<String> updateBudget(@AuthenticationPrincipal User user, @RequestBody Map<String, Double> budgetRequest) {
        try {
            Double newBudget = budgetRequest.get("budget");
            if (newBudget == null || newBudget < 0) {
                return ResponseEntity.badRequest().body("Invalid budget amount");
            }

            userDetailsServiceImp.updateUserBudget(user, newBudget);
            return ResponseEntity.ok("Budget updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update budget");
        }
    }

}
