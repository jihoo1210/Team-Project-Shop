package com.example.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.review.IndexReviewResponse;
import com.example.backend.dto.review.ReviewCreateRequest;
import com.example.backend.entity.item.Item;
import com.example.backend.entity.review.Review;
import com.example.backend.entity.user.User;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.item.ItemRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ReviewService {
    
    private final ItemRepository itemRepository;
    private final ReviewRepository reviewRepository;


    public List<IndexReviewResponse> indexReview(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        List<Review> reviews = reviewRepository.findAllByItem(item);
        
        return reviews.stream().map(review -> IndexReviewResponse.builder()
                .content(review.getContent())
                .score(review.getScore())
                .created_at(review.getCreatedAt())
                .updated_at(review.getUpdatedAt())
                .build()).toList();
    }

    @Transactional
    public void createReview(Long itemId, ReviewCreateRequest dto, User user) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        Review review = Review.builder()
                .content(dto.getContent())
                .score(dto.getScore())
                .item(item)
                .user(user)
                .build();
        reviewRepository.save(review);
    }

    @Transactional
    public void updateReview(Long reviewId, ReviewCreateRequest dto) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.update(dto);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}
