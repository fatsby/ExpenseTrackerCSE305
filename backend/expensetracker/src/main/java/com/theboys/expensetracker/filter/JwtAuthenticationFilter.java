package com.theboys.expensetracker.filter;

import com.theboys.expensetracker.service.JwtService;
import com.theboys.expensetracker.service.UserDetailsServiceImp;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsServiceImp userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsServiceImp userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }


    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,@NonNull HttpServletResponse response,@NonNull FilterChain filterChain) throws ServletException, IOException {
        System.out.println("Path = " + request.getServletPath()); // useful for debugging

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = authHeader.substring(7);
        String username = jwtService.gerUsernameFromToken(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            //DEBUGGING PURPOSES. TO CHECK FOR ROLE
            System.out.println("User Role(s): " + userDetails.getAuthorities());

            if (jwtService.isValid(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
