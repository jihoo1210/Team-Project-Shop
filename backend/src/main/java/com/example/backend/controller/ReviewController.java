package com.example.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.dto.review.IndexReviewResponse;
import com.example.backend.dto.review.ReviewCreateRequest;
import com.example.backend.entity.user.User;
import com.example.backend.service.ReviewService;
import com.example.backend.service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RequiredArgsConstructor
@RestController
@RequestMapping("/api/review")
public class ReviewController {
    
    private final ReviewService reviewService;
    private final UserService userService;

    @GetMapping("/{itemId}")
    public ResponseEntity<?> indexReview(@PathVariable Long itemId) {
        try {
            List<IndexReviewResponse> response = reviewService.indexReview(itemId);
            return ResponseController.success(response);
        } catch (Exception e) {
            return ResponseController.error(e);
        }
    }

    @PostMapping("/{itemId}")
    public ResponseEntity<?> createReview(@PathVariable Long itemId, @RequestBody ReviewCreateRequest dto) {
        try {
            User user = userService.checkLoginAndGetUser();
            reviewService.createReview(itemId, dto, user);
            return ResponseController.success(null);
        } catch (Exception e) {
            return ResponseController.error(e);
        }
    }

    @PutMapping("{reviewId}")
    public ResponseEntity<?> putMethodName(@PathVariable Long reviewId, @RequestBody ReviewCreateRequest dto) {
        try {
            reviewService.updateReview(reviewId, dto);
            return ResponseController.success(null);
        } catch(Exception e) {
            return ResponseController.error(e);
        }
    }

    @DeleteMapping("{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseController.success(null);
        } catch(Exception e) {
            return ResponseController.error(e);
        }
    }
    
}
