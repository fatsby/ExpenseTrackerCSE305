package com.theboys.expensetracker.model;

import jakarta.persistence.*;

import java.time.LocalDate;

// Base abstract class with shared fields
@MappedSuperclass
public abstract class FinancialTransaction<T extends Enum<T>> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String description;

    @Column(nullable = false, columnDefinition = "DOUBLE DEFAULT 0")
    private double amount;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private T category;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Common getters/setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public T getCategory() {
        return category;
    }

    public void setCategory(T category) {
        this.category = category;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getUserId(){
        return user.getId();
    }
    // ... other common methods ...
}