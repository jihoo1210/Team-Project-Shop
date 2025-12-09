package com.example.backend.service;

import com.example.backend.dto.CommentDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    public List<CommentDTO> getCommentList(Long boardNo, Long userId, boolean isAdmin) {
        // TODO: Implement comment list retrieval
        return List.of();
    }

    public CommentDTO write(Long boardNo, CommentDTO commentDTO, Long userId, boolean isAdmin) {
        // TODO: Implement comment write
        return commentDTO;
    }

    public CommentDTO update(Long coNo, CommentDTO commentDTO, Long userId, boolean isAdmin) {
        // TODO: Implement comment update
        return commentDTO;
    }

    public void delete(Long coNo, Long userId, boolean isAdmin) {
        // TODO: Implement comment delete
    }
}
