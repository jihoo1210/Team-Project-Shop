package com.example.backend.entity.board;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "board_file")
public class BoardFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_no")
    private Long fileNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_no")
    private Board board;

    @Column(name = "origin_filename", length = 255)
    private String originFilename; // 원본 파일명

    @Column(name = "save_filename", length = 255)
    private String saveFilename; // 저장 파일명

    @Column(name = "file_size")
    private Long fileSize; // 파일 크기

    @Column(name = "file_ext", length = 20)
    private String fileExt; // 파일 확장자

    @CreationTimestamp
    @Column(name = "reg_date", updatable = false)
    private LocalDateTime regDate; // 등록일

    @Builder
    public BoardFile(String originFilename, String saveFilename, Long fileSize, String fileExt) {
        this.originFilename = originFilename;
        this.saveFilename = saveFilename;
        this.fileSize = fileSize;
        this.fileExt = fileExt;
    }

    // Board 연관관계 설정 (패키지 레벨)
    void setBoard(Board board) {
        this.board = board;
    }
}

