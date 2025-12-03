package com.example.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long coNo;           // 댓글 번호
    private Long boardNo;        // 게시글 번호
    private Long writerId;       // 작성자 ID
    private String writerName;   // 작성자 이름 (화면 표시용)
    private String coComment;    // 댓글 내용
    private String secretYn;     // 비밀 댓글 여부
    private String delYn;        // 삭제 여부
    private LocalDateTime coRegDate;  // 등록일
    private LocalDateTime coModDate;  // 수정일
}
