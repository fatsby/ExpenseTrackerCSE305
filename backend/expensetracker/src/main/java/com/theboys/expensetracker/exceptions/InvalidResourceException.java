package com.theboys.expensetracker.exceptions;

public class InvalidResourceException extends RuntimeException{
    public InvalidResourceException(String message){
        super(message);
    }
}
