package com.theboys.expensetracker.controller;

import com.theboys.expensetracker.model.Expense;
import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
public class ExpenseController {
    ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/api/expenses")
    public ResponseEntity<List<Expense>> getUserExpenses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(expenseService.getExpensesByUser(user));
    }

    @PostMapping("/api/new_expense")
    public ResponseEntity<Expense> createExpense(@AuthenticationPrincipal User user, @RequestBody Expense expenseRequest) {

        expenseRequest.setUser(user);
        expenseRequest.setDate(LocalDate.now());

        Expense savedExpense = expenseService.saveExpense(expenseRequest);
        return ResponseEntity.ok(savedExpense);
    }

}
