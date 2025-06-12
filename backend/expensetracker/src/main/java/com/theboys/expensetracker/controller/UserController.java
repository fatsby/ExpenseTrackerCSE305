package com.theboys.expensetracker.controller;

import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.service.UserDetailsServiceImp;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

   UserDetailsServiceImp userDetailsServiceImp;

    public UserController(UserDetailsServiceImp userService) {
        this.userDetailsServiceImp = userService;
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello World");
    }

    @GetMapping("/budget")
    public ResponseEntity<Double> getBudget(@AuthenticationPrincipal User user) {
        double budget = userDetailsServiceImp.getUserBudget(user);
        return ResponseEntity.ok(budget);
    }

    @GetMapping("/money")
    public ResponseEntity<Double> getMoney(@AuthenticationPrincipal User user) {
        double money = userDetailsServiceImp.getUserMoney(user);
        return ResponseEntity.ok(money);
    }

    @PatchMapping("/budget")
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

    @GetMapping("api/user/pin")
    public ResponseEntity<Integer> getPin(@AuthenticationPrincipal User user) {
        int pin = userDetailsServiceImp.getUserPin(user);
        return ResponseEntity.ok(pin);
    }

}
