package com.example.backend.repository.item;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.details.ItemImage;

public interface ItemImageRepository extends JpaRepository<ItemImage, Long> {
    void deleteByItem(Item item);
}
