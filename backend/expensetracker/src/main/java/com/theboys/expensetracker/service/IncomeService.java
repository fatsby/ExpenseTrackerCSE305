package com.theboys.expensetracker.service;
import com.theboys.expensetracker.exceptions.InvalidResourceException;
import com.theboys.expensetracker.model.Category;
import com.theboys.expensetracker.model.Income;
import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.repo.IncomeRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class IncomeService {

    private final IncomeRepo incomeRepo;

    public IncomeService(IncomeRepo incomeRepo) {
        this.incomeRepo = incomeRepo;
    }

    public List<Income> getIncomeByUser(User user) {
        return incomeRepo.findByUser(user);
    }


    public Income saveIncome(Income income) {
        // Business rule: don’t allow negative expenses
        if (income.getAmount() < 0) {
            throw new IllegalArgumentException("Expense amount must be positive");
        }

        return incomeRepo.save(income);
    }

    public void deleteIncome(int id) {
        incomeRepo.deleteById(id);
    }

    public Income editIncome(Income income, String description, int amount, LocalDate date, Category category) {
        income.setDescription(description);
        income.setAmount(amount);
        income.setDate(date);
        income.setCategory(category);

        return incomeRepo.save(income);
    }

    public Income getIncomeById(int id){
        try {
            return incomeRepo.findById(id).get();
        } catch (Exception error){
            throw new InvalidResourceException("Income does not exists");
        }
    }
}
