package com.example.backend.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class CommentDTO {
    private int coNo;            // 댓글 번호 (PK)
    private int boardNo;         // 어느 글의 댓글인지 (FK)
    private String userName;     // 작성자 ID (FK)
    private String coContent;    // 댓글 내용
    private Timestamp coRegDate; // 작성일
}