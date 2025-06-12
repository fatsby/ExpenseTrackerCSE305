package com.theboys.expensetracker.repo;

import com.theboys.expensetracker.model.Category;
import com.theboys.expensetracker.model.Income;
import com.theboys.expensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface IncomeRepo extends JpaRepository<Income, Integer> {

    List<Income> findByUser(User user);
}
