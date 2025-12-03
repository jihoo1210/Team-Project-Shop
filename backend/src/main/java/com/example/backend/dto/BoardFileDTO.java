package com.example.backend.dto;

import java.sql.Timestamp;
import lombok.Data;

@Data
public class BoardFileDTO {
    private int fileNo;            // 파일 번호 (PK)
    private int boardNo;           // 게시글 번호 (FK)
    private String originFilename; // 원본 파일명
    private String saveFilename;   // 저장 파일명
    private long fileSize;         // 파일 크기
    private String fileExt;        // 파일 확장자
    private Timestamp regDate;     // 등록일
}

