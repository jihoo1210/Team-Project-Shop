package com.example.backend.controller;

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.dto.CommentDTO;
import com.example.backend.service.CommentService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 댓글 목록 조회 (게시글별)
    @GetMapping("/board/{boardNo}")
    public ResponseEntity<?> getCommentList(
            @PathVariable Long boardNo,
            HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("loginUserId");
            String role = (String) session.getAttribute("loginUserRole");
            boolean isAdmin = "ADMIN".equals(role);

            return ResponseController.success(commentService.getCommentList(boardNo, userId, isAdmin));
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 댓글 작성
    @PostMapping("/board/{boardNo}")
    public ResponseEntity<?> writeComment(
            @PathVariable Long boardNo,
            @RequestBody CommentDTO commentDTO,
            HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUserId");
        if (userId == null) {
            return ResponseController.fail("로그인이 필요합니다.");
        }

        String role = (String) session.getAttribute("loginUserRole");
        boolean isAdmin = "ADMIN".equals(role);

        try {
            CommentDTO saved = commentService.write(boardNo, commentDTO, userId, isAdmin);
            return ResponseController.success(saved);
        } catch (Exception e) {
            return ResponseController.fail(e);
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
            return ResponseController.fail("로그인이 필요합니다.");
        }

        String role = (String) session.getAttribute("loginUserRole");
        boolean isAdmin = "ADMIN".equals(role);

        try {
            CommentDTO updated = commentService.update(coNo, commentDTO, userId, isAdmin);
            return ResponseController.success(updated);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 댓글 삭제 (작성자 또는 관리자 가능)
    @DeleteMapping("/{coNo}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long coNo,
            HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUserId");
        if (userId == null) {
            return ResponseController.fail("로그인이 필요합니다.");
        }

        String role = (String) session.getAttribute("loginUserRole");
        boolean isAdmin = "ADMIN".equals(role);

        try {
            commentService.delete(coNo, userId, isAdmin);
            return ResponseController.success("삭제 성공");
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }
}
