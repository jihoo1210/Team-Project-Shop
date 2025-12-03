package com.example.backend.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.BoardDTO;
import com.example.backend.service.BoardServiceImpl;

@RestController
@RequestMapping("/api/board")
public class BoardController {

    @Autowired
    private BoardServiceImpl boardService;

    // 목록
    @GetMapping("/list")
    public ResponseEntity<?> getList(@RequestParam(defaultValue = "1") int page,
                                     @RequestParam(required = false) String category,
                                     @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(boardService.getList(page, category, keyword));
    }

    // 글쓰기
    @PostMapping("/write")
    public ResponseEntity<?> write(BoardDto board, 
                                   @RequestParam(required = false) MultipartFile file, 
                                   HttpSession session) {
        
        Long userId = (Long) session.getAttribute("loginUserId");

        if (userId == null) return ResponseEntity.status(401).body("로그인 필요");

        try {
            boardService.write(board, file, userId);
            return ResponseEntity.ok("작성 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("에러 발생: " + e.getMessage());
        }
    }

    // 상세 조회
    @GetMapping("/{boardNo}")
    public ResponseEntity<?> getBoard(@PathVariable Long boardNo) {
        try {
            return ResponseEntity.ok(boardService.getBoard(boardNo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // 글 수정
    @PutMapping("/{boardNo}")
    public ResponseEntity<?> update(@PathVariable Long boardNo,
                                    @RequestBody BoardDto boardDto,
                                    HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUserId");

        if (userId == null) return ResponseEntity.status(401).body("로그인 필요");

        try {
            boardService.update(boardNo, boardDto, userId);
            return ResponseEntity.ok("수정 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // 글 삭제
    @DeleteMapping("/{boardNo}")
    public ResponseEntity<?> delete(@PathVariable Long boardNo, HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUserId");

        if (userId == null) return ResponseEntity.status(401).body("로그인 필요");

        try {
            boardService.delete(boardNo, userId);
            return ResponseEntity.ok("삭제 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
