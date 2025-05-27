package com.theboys.expensetracker.service;

import com.theboys.expensetracker.model.AuthenticationResponse;
import com.theboys.expensetracker.model.Role;
import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.repo.UserRepo;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;



    public AuthenticationService(UserRepo userRepo, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(User request){
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPin(request.getPin());

        user.setBudget(8000);
        user.setRole(Role.USER);  // Default role
        user.setMoney(0);         // Default money

        user = userRepo.save(user);

        String role = user.getRole().name();
        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token, role);
    }

    public AuthenticationResponse authenticate(User request){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(user);

        // Role is an enum, so we get its name (e.g., "ADMIN")
        String role = user.getRole().name();

        return new AuthenticationResponse(token, role);
    }
}
