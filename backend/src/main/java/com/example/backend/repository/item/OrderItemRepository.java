package com.example.backend.repository.item;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.item.utility.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
}
