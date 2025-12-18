package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    @JsonProperty("co_no")
    private Long coNo;

    @JsonProperty("board_no")
    private Long boardNo;

    @JsonProperty("writer_id")
    private Long writerId;

    @JsonProperty("writer_name")
    private String writerName;

    @JsonProperty("co_comment")
    private String coComment;

    @JsonProperty("secret_yn")
    private String secretYn;

    @JsonProperty("del_yn")
    private String delYn;

    @JsonProperty("co_reg_date")
    private LocalDateTime coRegDate;

    @JsonProperty("co_mod_date")
    private LocalDateTime coModDate;
}
