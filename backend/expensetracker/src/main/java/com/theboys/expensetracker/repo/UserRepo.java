package com.theboys.expensetracker.repo;

import com.theboys.expensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
