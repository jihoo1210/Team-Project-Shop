package com.example.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BoardFileDTO {
    private Long fileNo;            // 파일 번호 (PK)
    private Long boardNo;           // 게시글 번호 (FK)
    private String originFilename; // 원본 파일명
    private String saveFilename;   // 저장 파일명
    private long fileSize;         // 파일 크기
    private String fileExt;        // 파일 확장자
    private LocalDateTime regDate; // 등록일
}
