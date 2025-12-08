package com.example.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.backend.entity.user.User;

@Service
public class UserService {

        
    public User checkLoginAndGetUser() throws Exception {
        User user = SecurityContextHolder.getContext().getAuthentication().getPrincipal() 
        instanceof User ? (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal() : null;
        if(user == null) {
            throw new IllegalAccessException("로그인이 필요합니다");
        }
        return user;
    }
    
}