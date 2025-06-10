package com.theboys.expensetracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "income")
public class Income extends FinancialTransaction<Category> {
}