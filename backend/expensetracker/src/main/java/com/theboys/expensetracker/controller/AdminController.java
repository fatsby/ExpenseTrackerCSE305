package com.theboys.expensetracker.controller;

import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.service.AuthenticationService;
import com.theboys.expensetracker.service.UserDetailsServiceImp;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/api")
public class AdminController {
    private final UserDetailsServiceImp userService;
    private final AuthenticationService authenticationService;

    public AdminController(UserDetailsServiceImp userService, AuthenticationService authenticationService) {
        this.userService = userService;
        this.authenticationService = authenticationService;
    }

    @PutMapping("/users/{userId}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable int userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok("User account deactivated successfully");
    }

    @PutMapping("/users/{userId}/activate")
    public ResponseEntity<String> activateUser(@PathVariable int userId) {
        userService.activateUser(userId);
        return ResponseEntity.ok("User account activated successfully");
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User account deleted successfully");
    }

    @PostMapping("/users/create")
    public ResponseEntity<String> createUser(@RequestBody User userRequest) {
        try {
            User createdUser = authenticationService.adminCreate(userRequest);
            return ResponseEntity.ok("User '" + createdUser.getUsername() + "' created successfully with ID: " + createdUser.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }
}


