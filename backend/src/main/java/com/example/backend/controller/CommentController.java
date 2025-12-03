package com.example.backend.controller;

import com.example.backend.dto.CommentDTO;
import com.example.backend.service.CommentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 댓글 목록 조회 (게시글별)
    @GetMapping("/board/{boardNo}")
    public ResponseEntity<List<CommentDTO>> getCommentList(
            @PathVariable Long boardNo,
            HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUserId");
        String role = (String) session.getAttribute("loginUserRole");
        boolean isAdmin = "ADMIN".equals(role);

        return ResponseEntity.ok(commentService.getCommentList(boardNo, userId, isAdmin));
    }

    // 댓글 작성
    @PostMapping("/board/{boardNo}")
    public ResponseEntity<?> writeComment(
            @PathVariable Long boardNo,
            @RequestBody CommentDTO commentDTO,
            HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUserId");
        if (userId == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String role = (String) session.getAttribute("loginUserRole");
        boolean isAdmin = "ADMIN".equals(role);

        try {
            CommentDTO saved = commentService.write(boardNo, commentDTO, userId, isAdmin);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 댓글 수정 (작성자만 가능)
    @PutMapping("/{coNo}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long coNo,
            @RequestBody CommentDTO commentDTO,
            HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUserId");
        if (userId == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String role = (String) session.getAttribute("loginUserRole");
        boolean isAdmin = "ADMIN".equals(role);

        try {
            CommentDTO updated = commentService.update(coNo, commentDTO, userId, isAdmin);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // 댓글 삭제 (작성자 또는 관리자 가능)
    @DeleteMapping("/{coNo}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long coNo,
            HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUserId");
        if (userId == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String role = (String) session.getAttribute("loginUserRole");
        boolean isAdmin = "ADMIN".equals(role);

        try {
            commentService.delete(coNo, userId, isAdmin);
            return ResponseEntity.ok("삭제 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}

