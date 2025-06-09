package com.theboys.expensetracker.service;

import com.theboys.expensetracker.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    private final String SECRET_KEY = "53a054a73aba2b42dad5f28a0c634c792707e19ff68b0b59032c0bf4f8dc8e29";

    public String generateToken(User user){
        String token = Jwts.builder()
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
                .signWith(getSecretKey())
                .compact();

        return token;
    }

    private SecretKey getSecretKey(){
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims getClaimsFromToken(String token){
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T getClaim(String token, Function<Claims, T> resolver){
        Claims claims = getClaimsFromToken(token);
        return resolver.apply(claims);
    }

    public String gerUsernameFromToken(String token){
        return getClaim(token, Claims::getSubject);
    }

    public boolean isValid(String token, UserDetails user){
        String username = gerUsernameFromToken(token);
        return user.getUsername().equals(username) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token){
        return getClaim(token, Claims::getExpiration);
    }
}
