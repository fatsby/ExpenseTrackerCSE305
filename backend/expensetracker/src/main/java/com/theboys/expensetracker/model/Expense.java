package com.theboys.expensetracker.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "expense")
public class Expense extends FinancialTransaction<Category> {
}