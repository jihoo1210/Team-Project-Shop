package com.example.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BoardDTO {
    private Long boardNo;          // 게시글 번호
    private Long writerId;         // 작성자 ID (FK)
    private String writerName;     // 작성자 이름 (화면 표시용)

    private String boardCategory;  // 말머리 (board_category)
    private String title;          // 제목
    private String content;        // 내용
    private int views;             // 조회수

    private String secretYn;       // 비밀글 여부
    private String delYn;          // 삭제 여부

    private LocalDateTime regDate; // 작성일
    private LocalDateTime modDate; // 수정일

    private long commentCount;     // 댓글 수 (화면 표시용)
    private List<BoardFileDTO> files; // 첨부파일 목록
}
