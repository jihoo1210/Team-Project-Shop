package com.example.backend.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.BoardDTO;
import com.example.backend.dto.BoardFileDTO;
import com.example.backend.service.BoardServiceImpl;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

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
    public ResponseEntity<?> write(BoardDTO board, 
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

    // 상세 조회 (비밀글 권한 체크)
    @GetMapping("/{boardNo}")
    public ResponseEntity<?> getBoard(@PathVariable Long boardNo, HttpSession session) {
        // 세션에서 사용자 정보 가져오기 (비로그인도 조회 가능하도록)
        Long userId = (Long) session.getAttribute("loginUserId");
        String role = (String) session.getAttribute("loginUserRole");
        boolean isAdmin = "ADMIN".equals(role);

        try {
            return ResponseEntity.ok(boardService.getBoard(boardNo, userId, isAdmin));
        } catch (IllegalArgumentException e) {
            // 비밀글 접근 권한 없음
            if (e.getMessage().contains("비밀글")) {
                return ResponseEntity.status(403).body(e.getMessage());
            }
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // 글 수정 (작성자만 가능)
    @PutMapping("/{boardNo}")
    public ResponseEntity<?> update(@PathVariable Long boardNo,
                                    @RequestBody BoardDTO boardDTO,
                                    HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUserId");

        if (userId == null) return ResponseEntity.status(401).body("로그인 필요");

        try {
            boardService.update(boardNo, boardDTO, userId);
            return ResponseEntity.ok("수정 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // 글 삭제 (작성자 또는 관리자 가능)
    @DeleteMapping("/{boardNo}")
    public ResponseEntity<?> delete(@PathVariable Long boardNo, HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUserId");
        String role = (String) session.getAttribute("loginUserRole");

        if (userId == null) return ResponseEntity.status(401).body("로그인 필요");

        boolean isAdmin = "ADMIN".equals(role);

        try {
            boardService.delete(boardNo, userId, isAdmin);
            return ResponseEntity.ok("삭제 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // 파일 다운로드
    @GetMapping("/file/{fileNo}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileNo) {
        try {
            Resource resource = boardService.downloadFile(fileNo);
            BoardFileDTO fileDTO = boardService.getFileInfo(fileNo);

            String contentType = Files.probeContentType(Paths.get(fileDTO.getOriginFilename()));
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + URLEncoder.encode(fileDTO.getOriginFilename(), StandardCharsets.UTF_8) + "\"")
                    .body(resource);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(null);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
