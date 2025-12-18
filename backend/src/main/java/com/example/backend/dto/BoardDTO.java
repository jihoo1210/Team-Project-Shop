package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BoardDTO {
    @JsonProperty("board_no")
    private Long boardNo;

    @JsonProperty("writer_id")
    private Long writerId;

    @JsonProperty("writer_name")
    private String writerName;

    @JsonProperty("board_category")
    private String boardCategory;

    private String title;
    private String content;

    @JsonProperty("view")
    private int views;

    @JsonProperty("secret_yn")
    private String secretYn;

    @JsonProperty("del_yn")
    private String delYn;

    @JsonProperty("reg_date")
    private LocalDateTime regDate;

    @JsonProperty("mod_date")
    private LocalDateTime modDate;

    @JsonProperty("comment_count")
    private long commentCount;

    private List<BoardFileDTO> files;
}
