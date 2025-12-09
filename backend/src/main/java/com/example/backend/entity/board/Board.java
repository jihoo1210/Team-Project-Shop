package com.example.backend.entity.board;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.backend.entity.board.details.FavoriteBoard;
import com.example.backend.entity.board.details.RecentBoard;
import com.example.backend.entity.comment.Comment;
import com.example.backend.entity.user.User;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "board")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_no")
    private Long boardNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id")
    private User writer;

    @Column(name = "board_category", length = 50)
    private String boardCategory;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "views", columnDefinition = "INT DEFAULT 0")
    private int views = 0;

    @Column(name = "secret_yn", length = 1, columnDefinition = "CHAR(1) DEFAULT 'N'")
    private String secretYn = "N";

    @Column(name = "del_yn", length = 1, columnDefinition = "CHAR(1) DEFAULT 'N'")
    private String delYn = "N";

    @CreationTimestamp
    @Column(name = "reg_date", updatable = false)
    private LocalDateTime regDate;

    @UpdateTimestamp
    @Column(name = "mod_date")
    private LocalDateTime modDate;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardFile> files = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FavoriteBoard> favoriteBoardList = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecentBoard> recentBoardList = new ArrayList<>();

    @Builder
    public Board(User writer, String boardCategory, String title, String content, String secretYn) {
        this.writer = writer;
        this.boardCategory = boardCategory;
        this.title = title;
        this.content = content;
        this.secretYn = secretYn != null ? secretYn : "N";
    }

    // 파일 추가 (연관관계 편의 메서드)
    public void addFile(BoardFile file) {
        this.files.add(file);
        file.setBoard(this);
    }

    // 댓글 추가 (연관관계 편의 메서드)
    public void addComment(Comment comment) {
        this.comments.add(comment);
        comment.setBoard(this);
    }

    // 글 수정
    public void update(String title, String content, String boardCategory, String secretYn) {
        this.title = title;
        this.content = content;
        this.boardCategory = boardCategory;
        this.secretYn = secretYn;
    }

    // 소프트 삭제
    public void delete() {
        this.delYn = "Y";
    }
}
