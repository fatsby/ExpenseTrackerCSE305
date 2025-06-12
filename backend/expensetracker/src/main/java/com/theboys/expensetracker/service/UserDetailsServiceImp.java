package com.theboys.expensetracker.service;
import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.repo.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserDetailsServiceImp implements UserDetailsService {
    private UserRepo userRepo;

    public UserDetailsServiceImp(UserRepo userRepo) {
        this.userRepo = userRepo;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
    }

    public List<User> getAllUsers(){
        return userRepo.findAll();
    }

    public Double getUserBudget(User user){
        return user.getBudget();
    }

    public Double getUserMoney(User user){
        return user.getMoney();
    }

    public void setUserMoney(User user, Double money){
        User existingUser = userRepo.findById(user.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        existingUser.setMoney(money);
        userRepo.save(existingUser);
    }

    public void updateUserBudget(User user, Double newBudget) {
        User existingUser = userRepo.findById(user.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        existingUser.setBudget(newBudget);
        userRepo.save(existingUser);
    }

    public int getUserPin(User user){
        return user.getPin();
    }

    public void deactivateUser(int userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEnabled(false);
        userRepo.save(user);
    }

    public void activateUser(int userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEnabled(true);
        userRepo.save(user);
    }

    public void deleteUser(int userId){
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        userRepo.delete(user);
    }
}
