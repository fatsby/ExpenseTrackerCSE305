package com.theboys.expensetracker.service;

import com.theboys.expensetracker.exceptions.UserAlreadyExistsException;
import com.theboys.expensetracker.model.AuthenticationResponse;
import com.theboys.expensetracker.model.Role;
import com.theboys.expensetracker.model.User;
import com.theboys.expensetracker.repo.UserRepo;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

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

        if (userRepo.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username '" + request.getUsername() + "' is already taken.");
        }

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
        Date expiration = jwtService.extractExpiration(token);

        return new AuthenticationResponse(token, role, expiration);
    }

    public User adminCreate(User userRequest){
        if (userRepo.existsByUsername(userRequest.getUsername())) {
            throw new RuntimeException("Username '" + userRequest.getUsername() + "' already exists");
        }

        // Create new user
        User newUser = new User();
        newUser.setUsername(userRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        newUser.setRole(userRequest.getRole());

        // Set default values
        newUser.setPin(1234); // Default PIN
        newUser.setBudget(8000.0); // Default budget
        newUser.setMoney(0.0); // Default money
        newUser.setEnabled(true); // Default enabled

        return userRepo.save(newUser);
    }

    public AuthenticationResponse authenticate(User request){
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        }

        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isEnabled()) {
            throw new BadCredentialsException("Your account is disabled");
        }

        String token = jwtService.generateToken(user);
        String role = user.getRole().name();
        Date expiration = jwtService.extractExpiration(token);

        return new AuthenticationResponse(token, role, expiration);
    }

}
