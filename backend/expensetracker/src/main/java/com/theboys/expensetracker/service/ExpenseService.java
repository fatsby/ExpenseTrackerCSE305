package com.theboys.expensetracker.service;

import com.theboys.expensetracker.exceptions.InvalidResourceException;
import com.theboys.expensetracker.model.Category;
import com.theboys.expensetracker.model.Expense;
import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.repo.ExpenseRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepo expenseRepo;

    public ExpenseService(ExpenseRepo expenseRepo) {
        this.expenseRepo = expenseRepo;
    }

    public List<Expense> getExpensesByUser(User user) {
        return expenseRepo.findByUser(user);
    }

    public List<Expense> getExpensesByDateRange(User user, LocalDate start, LocalDate end) {
        return expenseRepo.findByUserAndDateBetween(user, start, end);
    }

    public List<Expense> getExpensesByCategory(User user, Category category) {
        return expenseRepo.findByUserAndCategory(user, category);
    }

    public Expense saveExpense(Expense expense) {
        // Business rule: don’t allow negative expenses
        if (expense.getAmount() < 0) {
            throw new IllegalArgumentException("Expense amount must be positive");
        }

        return expenseRepo.save(expense);
    }

    public void deleteExpense(int id) {
        expenseRepo.deleteById(id);
    }

    public Expense editExpense(Expense expense, String description, int amount, LocalDate date, Category category) {
        expense.setDescription(description);
        expense.setAmount(amount);
        expense.setDate(date);
        expense.setCategory(category);

        return expenseRepo.save(expense);
    }

    public Expense getExpenseById(int id){
        try {
            return expenseRepo.findById(id).get();
        } catch (Exception error){
            throw new InvalidResourceException("Expense does not exists");
        }
    }
}
