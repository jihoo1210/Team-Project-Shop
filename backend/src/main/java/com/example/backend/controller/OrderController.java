package com.example.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.dto.order.OrderDetailResponse;
import com.example.backend.dto.order.OrderListResponse;
import com.example.backend.dto.order.OrderRequest;
import com.example.backend.entity.user.User;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



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
            return ResponseController.fail(e);

        }
    }

    /**
     * 주문 목록 조회
     */
    @GetMapping
    public ResponseEntity<?> getOrderList(
            @PageableDefault(size = 10, sort = "id", direction = Direction.DESC) org.springframework.data.domain.Pageable pageable) {
        try {
            User user = userService.checkLoginAndGetUser();
            Page<OrderListResponse> response = orderService.getOrderList(user, pageable);
            return ResponseController.success(response);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetail(@PathVariable("orderId") Long orderId) {
        try {
            OrderDetailResponse response = orderService.getDetail(orderId);
            return ResponseController.success(response);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

}
