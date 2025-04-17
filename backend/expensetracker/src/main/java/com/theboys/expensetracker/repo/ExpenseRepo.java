package com.theboys.expensetracker.repo;

import com.theboys.expensetracker.model.Category;
import com.theboys.expensetracker.model.Expense;
import com.theboys.expensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepo extends JpaRepository<Expense, Integer> {

    List<Expense> findByUser(User user);

    List<Expense> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);

    List<Expense> findByUserAndCategory(User user, Category category);
}
