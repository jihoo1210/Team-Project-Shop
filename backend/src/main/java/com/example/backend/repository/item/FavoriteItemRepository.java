package com.example.backend.repository.item;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.utility.FavoriteItem;
import com.example.backend.entity.user.User;

public interface FavoriteItemRepository extends JpaRepository<FavoriteItem, Long>, JpaSpecificationExecutor<FavoriteItem> {
    boolean existsByItemAndUser(Item item, User user);
    Optional<FavoriteItem> findByItemAndUser(Item item, User user);
}
