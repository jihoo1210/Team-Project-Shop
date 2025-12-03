package com.example.backend.entity.comment;

import com.example.backend.entity.board.Board;
import com.example.backend.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "co_no")
    private Long coNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_no")
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id")
    private User writer;

    @Column(name = "co_comment", columnDefinition = "TEXT")
    private String coComment;

    @Column(name = "del_yn", length = 1, columnDefinition = "CHAR(1) DEFAULT 'N'")
    private String delYn = "N";

    @CreationTimestamp
    @Column(name = "co_reg_date", updatable = false)
    private LocalDateTime coRegDate;

    @UpdateTimestamp
    @Column(name = "co_mod_date")
    private LocalDateTime coModDate;

    @Builder
    public Comment(User writer, String coComment) {
        this.writer = writer;
        this.coComment = coComment;
    }

    // Board 연관관계 설정
    public void setBoard(Board board) {
        this.board = board;
    }

    // 댓글 수정
    public void update(String coComment) {
        this.coComment = coComment;
    }

    // 삭제 처리 (소프트 삭제)
    public void delete() {
        this.delYn = "Y";
    }
}

