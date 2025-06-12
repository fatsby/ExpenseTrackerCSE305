package com.theboys.expensetracker.controller;

import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.service.UserDetailsServiceImp;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
