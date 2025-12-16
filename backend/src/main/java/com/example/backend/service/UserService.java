package com.example.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.backend.entity.user.User;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;    

    public User checkLoginAndGetUser() throws Exception {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(userId != null) {
            log.info("User Id: {}", userId);
            return userRepository.findById(userId).orElse(null);
        }
        return null;
    }
    
}