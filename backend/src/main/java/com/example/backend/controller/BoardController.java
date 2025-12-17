package com.example.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
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
import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardServiceImpl boardService;

    // 허용 이미지 확장자
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = List.of("jpg", "jpeg", "png", "gif", "webp");
    // 허용 파일 확장자 (이미지 + 문서)
    private static final List<String> ALLOWED_FILE_EXTENSIONS = List.of(
            "jpg", "jpeg", "png", "gif", "webp",  // 이미지
            "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip"  // 문서
    );
    // 최대 파일 크기 (10MB)
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    // 목록
    @GetMapping("/list")
    public ResponseEntity<?> getList(@RequestParam(defaultValue = "1") int page,
                                     @RequestParam(required = false) String category,
                                     @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(boardService.getList(page, category, keyword));
    }

    // 글쓰기 (다중 파일 업로드 지원)
    @PostMapping("/write")
    public ResponseEntity<?> write(BoardDTO board,
                                   @RequestParam(value = "uploadFiles", required = false) List<MultipartFile> uploadFiles,
                                   HttpServletRequest request) {

        Long userId = (Long) request.getAttribute("userId");

        if (userId == null) return ResponseEntity.status(401).body("로그인 필요");

        // 파일 검증
        if (uploadFiles != null && !uploadFiles.isEmpty()) {
            for (MultipartFile file : uploadFiles) {
                if (file.isEmpty()) continue;

                // 파일 크기 검증
                if (file.getSize() > MAX_FILE_SIZE) {
                    return ResponseEntity.badRequest()
                            .body("파일 크기는 10MB를 초과할 수 없습니다: " + file.getOriginalFilename());
                }

                // 확장자 검증
                String ext = getFileExtension(file.getOriginalFilename()).toLowerCase();
                if (!ALLOWED_FILE_EXTENSIONS.contains(ext)) {
                    return ResponseEntity.badRequest()
                            .body("허용되지 않는 파일 형식입니다: " + file.getOriginalFilename());
                }
            }
        }

        try {
            boardService.write(board, uploadFiles, userId);
            return ResponseEntity.ok("작성 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("에러 발생: " + e.getMessage());
        }
    }

    // 상세 조회 (비밀글 권한 체크)
    @GetMapping("/{boardNo}")
    public ResponseEntity<?> getBoard(@PathVariable Long boardNo, HttpServletRequest request) {
        // JWT에서 사용자 정보 가져오기 (비로그인도 조회 가능하도록)
        Long userId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");
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
                                    HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");

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
    public ResponseEntity<?> delete(@PathVariable Long boardNo, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

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

    // 이미지 미리보기 (브라우저에서 바로 표시)
    @GetMapping("/image/{fileNo}")
    public ResponseEntity<Resource> previewImage(@PathVariable Long fileNo) {
        try {
            BoardFileDTO fileDTO = boardService.getFileInfo(fileNo);
            
            // 이미지 파일인지 확인
            String ext = getFileExtension(fileDTO.getOriginFilename()).toLowerCase();
            if (!ALLOWED_IMAGE_EXTENSIONS.contains(ext)) {
                return ResponseEntity.badRequest().body(null);
            }

            Resource resource = boardService.downloadFile(fileNo);
            
            // Content-Type 결정
            String contentType = switch (ext) {
                case "jpg", "jpeg" -> "image/jpeg";
                case "png" -> "image/png";
                case "gif" -> "image/gif";
                case "webp" -> "image/webp";
                default -> "application/octet-stream";
            };

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=86400")  // 24시간 캐시
                    .body(resource);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(null);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // 파일 확장자 추출 헬퍼
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
