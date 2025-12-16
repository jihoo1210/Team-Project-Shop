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
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 비로그인 사용자의 경우 "anonymousUser" 문자열이 반환됨
        if (principal instanceof Long) {
            Long userId = (Long) principal;
            log.info("User Id: {}", userId);
            return userRepository.findById(userId).orElse(null);
        }

        return null;
    }
    
}