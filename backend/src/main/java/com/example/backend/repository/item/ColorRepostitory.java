package com.example.backend.repository.item;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.item.details.Color;
import com.example.backend.entity.item.Item;

public interface ColorRepostitory extends JpaRepository<Color, Long> {
    void deleteByItem(Item item);
}
