package com.example.backend.service;

import com.example.backend.dto.CommentDTO;
import com.example.backend.entity.board.Board;
import com.example.backend.entity.comment.Comment;
import com.example.backend.entity.user.User;
import com.example.backend.repository.BoardRepository;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    // 댓글 목록 조회
    public List<CommentDTO> getCommentList(Long boardNo) {
        List<Comment> comments = commentRepository.findByBoard_BoardNoAndDelYnOrderByCoRegDateAsc(boardNo, "N");
        return comments.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // 댓글 작성
    @Transactional
    public CommentDTO writeComment(Long boardNo, Long userId, String content) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Comment comment = Comment.builder()
                .writer(user)
                .coComment(content)
                .build();

        board.addComment(comment);
        commentRepository.save(comment);

        return toDTO(comment);
    }

    // 댓글 수정
    @Transactional
    public CommentDTO updateComment(Long coNo, Long userId, String content) {
        Comment comment = commentRepository.findById(coNo)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        // 작성자 확인
        if (!comment.getWriter().getUserId().equals(userId)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        comment.update(content);
        return toDTO(comment);
    }

    // 댓글 삭제 (소프트 삭제)
    @Transactional
    public void deleteComment(Long coNo, Long userId) {
        Comment comment = commentRepository.findById(coNo)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        // 작성자 확인
        if (!comment.getWriter().getUserId().equals(userId)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        comment.delete();
    }

    // 댓글 수 조회
    public long getCommentCount(Long boardNo) {
        return commentRepository.countByBoard_BoardNoAndDelYn(boardNo, "N");
    }

    // Entity -> DTO 변환
    private CommentDTO toDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setCoNo(comment.getCoNo());
        dto.setBoardNo(comment.getBoard().getBoardNo());
        dto.setWriterId(comment.getWriter().getUserId());
        dto.setWriterName(comment.getWriter().getUsername());
        dto.setCoComment(comment.getCoComment());
        dto.setDelYn(comment.getDelYn());
        dto.setCoRegDate(comment.getCoRegDate());
        dto.setCoModDate(comment.getCoModDate());
        return dto;
    }
}
