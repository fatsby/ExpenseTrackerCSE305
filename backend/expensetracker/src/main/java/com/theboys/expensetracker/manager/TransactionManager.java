package com.theboys.expensetracker.manager;

import com.theboys.expensetracker.exceptions.InvalidResourceException;
import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.service.UserDetailsServiceImp;

public class TransactionManager {
    private final UserDetailsServiceImp userService;

    public TransactionManager(UserDetailsServiceImp userService){
        this.userService = userService;
    }

    public void addMoney(User user, double amount){
        double finalAmount = amount + user.getMoney();
        userService.setUserMoney(user, finalAmount);
    }

    public void subtractMoney(User user, double amount){
        //check if user has enough money
        double userMoney = user.getMoney();
        if (userMoney < amount){
            throw new InvalidResourceException("You do not have enough money!");
        } else{
            double finalAmount = userMoney - amount;
            userService.setUserMoney(user, finalAmount);
        }
    }
}
