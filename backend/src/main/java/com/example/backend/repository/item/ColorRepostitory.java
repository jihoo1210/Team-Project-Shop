package com.example.backend.repository.item;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.details.Color;

public interface ColorRepostitory extends JpaRepository<Color, Long> {
    void deleteByItem(Item item);
}
