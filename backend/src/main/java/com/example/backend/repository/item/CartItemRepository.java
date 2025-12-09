package com.example.backend.repository.item;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.utility.CartItem;
import com.example.backend.entity.user.User;

public interface CartItemRepository extends JpaRepository<CartItem, Long>, JpaSpecificationExecutor<CartItem> {
    boolean existsByItemAndUser(Item item, User user);
    void deleteByItemAndUser(Item item, User user);
    List<CartItem> findAllByUser(User user);
    void deleteAllByUser(User user);
}
