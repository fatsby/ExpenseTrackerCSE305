package com.theboys.expensetracker.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Date;

public class AuthenticationResponse {
    private String token;
    private String role;
    private Date expiration;

    public AuthenticationResponse(String token, String role, Date expiration) {
        this.token = token;
        this.role = role;
        this.expiration = expiration;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public Date getExpiration() {
        return expiration;
    }
}
