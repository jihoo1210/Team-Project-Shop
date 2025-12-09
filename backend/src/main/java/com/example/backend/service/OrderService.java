package com.example.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.order.OrderDetailResponse;
import com.example.backend.dto.order.OrderRequest;
import com.example.backend.entity.item.utility.CartItem;
import com.example.backend.entity.item.utility.OrderItem;
import com.example.backend.entity.item.utility.OrderItemList;
import com.example.backend.entity.user.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.item.CartItemRepository;
import com.example.backend.repository.item.OrderItemListRepository;
import com.example.backend.repository.item.OrderItemRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrderService {
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderItemListRepository orderItemListRepository;
    private final CartItemRepository cartItemRepository;
    
    @Transactional
    public void order(OrderRequest dto, User user) {
        User orderUser = userRepository.findById(user.getUserId()).orElse(null);
        List<CartItem> cartItemList = cartItemRepository.findAllByUser(orderUser);

        int totalPrice = cartItemList.stream()
            .mapToInt(cartItem -> cartItem.getItem().getRealPrice() * cartItem.getNumber())
            .sum();

        OrderItem orderItem = OrderItem.builder()
            .user(orderUser)
            .call(dto.getCall())
            .addr(dto.getAddr())
            .zipcode(dto.getZipcode())
            .totalPrice(totalPrice)
            .build();
        orderItemRepository.save(orderItem);

        cartItemList.forEach(cartItem -> {
            OrderItemList orderItemList = OrderItemList.builder()
                .orderItem(orderItem)
                .item(cartItem.getItem())
                .number(cartItem.getNumber())
                .color(cartItem.getColor())
                .size(cartItem.getSize())
                .build();
            orderItemListRepository.save(orderItemList);
        });

        cartItemRepository.deleteAllByUser(orderUser);
    }

    public OrderDetailResponse getDetail(Long orderId) {
        OrderItem orderItem = orderItemRepository.findById(orderId).orElse(null);
        return OrderDetailResponse.builder()
            .items(orderItem.getItemList().stream().map(orderItemList -> orderItemList.getItem()).toList())
            .username(orderItem.getUser().getUsername())
            .addr(orderItem.getAddr())
            .call(orderItem.getCall())
            .zipcode(orderItem.getZipcode())
            .totalPrice(orderItem.getTotalPrice())
            .build();

    }
}
