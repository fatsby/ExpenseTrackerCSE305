package com.theboys.expensetracker.controller;

import com.theboys.expensetracker.exceptions.UnauthorizedActionException;
import com.theboys.expensetracker.manager.TransactionManager;
import com.theboys.expensetracker.model.Income;
import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.service.ExpenseService;
import com.theboys.expensetracker.service.IncomeService;
import com.theboys.expensetracker.service.UserDetailsServiceImp;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {
    IncomeService incomeService;
    TransactionManager transactionManager;

    public IncomeController(IncomeService incomeService, UserDetailsServiceImp userService) {
        this.incomeService = incomeService;
        this.transactionManager = new TransactionManager(userService);
    }

    @GetMapping
    public ResponseEntity<List<Income>> getUserIncome(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(incomeService.getIncomeByUser(user));
    }

    @PostMapping("/new")
    public ResponseEntity<Income> createIncome(@AuthenticationPrincipal User user, @RequestBody Income incomeRequest) {

        incomeRequest.setUser(user);
        incomeRequest.setDate(LocalDate.now());

        Income savedIncome = incomeService.saveIncome(incomeRequest);

        transactionManager.addMoney(user, savedIncome.getAmount());

        return ResponseEntity.ok(savedIncome);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIncome(@PathVariable int id, @AuthenticationPrincipal User user) {
        Income income = incomeService.getIncomeById(id);

        // Verify ownership
        if (!(income.getUserId() == user.getId())) {
            throw new UnauthorizedActionException("You are not authorized to delete this expense");
        }

        transactionManager.subtractMoney(user, income.getAmount());

        // Delete if owner matches
        incomeService.deleteIncome(id);
        return ResponseEntity
                .ok("Expense with id " + id + " deleted successfully.");
    }
}
