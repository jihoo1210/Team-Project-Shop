package com.example.backend.dto;

import java.sql.Timestamp;
import lombok.Data;

@Data
public class BoardDTO {

    private int boardNo;
    private int userNo;          // 작성자 회원번호
    private String writerName;   // 작성자 실명
    
    private String category;
    private String title;
    private String content;
    private int views;
    
    private String secretYn;
    private String delYn;
    
    private Timestamp regDate;
    private Timestamp modDate;
    
}