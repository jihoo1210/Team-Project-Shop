package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BoardFileDTO {
    @JsonProperty("file_no")
    private Long fileNo;

    @JsonProperty("board_no")
    private Long boardNo;

    @JsonProperty("origin_filename")
    private String originFilename;

    @JsonProperty("save_filename")
    private String saveFilename;

    @JsonProperty("file_size")
    private long fileSize;

    @JsonProperty("file_ext")
    private String fileExt;

    @JsonProperty("reg_date")
    private LocalDateTime regDate;
}
