package com.example.backend.repository.item;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.details.Size;

public interface SizeRepository extends JpaRepository<Size, Long> {
    void deleteByItem(Item item);
}
