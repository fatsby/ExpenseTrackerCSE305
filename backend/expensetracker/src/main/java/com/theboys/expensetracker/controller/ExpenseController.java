package com.theboys.expensetracker.controller;

import com.theboys.expensetracker.exceptions.UnauthorizedActionException;
import com.theboys.expensetracker.model.Expense;
import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getUserExpenses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(expenseService.getExpensesByUser(user));
    }

    @PostMapping("/new")
    public ResponseEntity<Expense> createExpense(@AuthenticationPrincipal User user, @RequestBody Expense expenseRequest) {

        expenseRequest.setUser(user);
        expenseRequest.setDate(LocalDate.now());

        Expense savedExpense = expenseService.saveExpense(expenseRequest);
        return ResponseEntity.ok(savedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable int id, @AuthenticationPrincipal User user) {
        Expense expense = expenseService.getExpenseById(id);

        // Verify ownership
        if (!(expense.getUserId() == user.getId())) {
            throw new UnauthorizedActionException("You are not authorized to delete this expense");
        }

        // Delete if owner matches
        expenseService.deleteExpense(id);
        return ResponseEntity
                .ok("Expense with id " + id + " deleted successfully.");
    }
}
