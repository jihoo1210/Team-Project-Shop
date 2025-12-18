package com.example.backend.repository.item;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.item.utility.OrderItem;
import com.example.backend.entity.user.User;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByUserOrderByIdDesc(User user);
    Page<OrderItem> findByUserOrderByIdDesc(User user, Pageable pageable);
}
