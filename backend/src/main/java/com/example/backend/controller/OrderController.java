package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.dto.order.OrderDetailResponse;
import com.example.backend.dto.order.OrderRequest;
import com.example.backend.entity.user.User;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RequiredArgsConstructor
@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final UserService userService;
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> order(@RequestBody OrderRequest dto) {
        try {
            User user = userService.checkLoginAndGetUser();
            orderService.order(dto, user);
            return ResponseController.success(null);
        } catch (Exception e) {
            return ResponseController.error(e);
            
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetail(@PathVariable Long orderId) {
        try {
            OrderDetailResponse response = orderService.getDetail(orderId);
            return ResponseController.success(response);
        } catch (Exception e) {
            return ResponseController.error(e);
        }
    }
    
}
