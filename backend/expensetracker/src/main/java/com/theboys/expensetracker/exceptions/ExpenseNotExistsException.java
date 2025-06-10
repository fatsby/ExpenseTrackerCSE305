package com.theboys.expensetracker.exceptions;

public class ExpenseNotExistsException extends RuntimeException {
    public ExpenseNotExistsException(String message) {
        super(message);
    }
}
