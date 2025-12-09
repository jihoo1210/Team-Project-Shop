package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.review.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByItem(Item item);
}
