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

    // 댓글 목록 조회 (비밀 댓글 권한 체크 포함)
    public List<CommentDTO> getCommentList(Long boardNo, Long userId, boolean isAdmin) {
        List<Comment> comments = commentRepository.findByBoard_BoardNoAndDelYnOrderByCoRegDateAsc(boardNo, "N");
        return comments.stream()
                .map(comment -> toDTO(comment, userId, isAdmin))
                .collect(Collectors.toList());
    }

    // 댓글 작성
    @Transactional
    public CommentDTO write(Long boardNo, CommentDTO commentDTO, Long userId, boolean isAdmin) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Comment comment = Comment.builder()
                .writer(user)
                .coComment(commentDTO.getCoComment())
                .secretYn(commentDTO.getSecretYn()) // 비밀 댓글 여부
                .build();

        board.addComment(comment);
        commentRepository.save(comment);

        return toDTO(comment, userId, isAdmin);
    }

    // 댓글 수정 (작성자만 가능, 관리자 불가)
    @Transactional
    public CommentDTO update(Long coNo, CommentDTO commentDTO, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(coNo)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        // 작성자만 수정 가능 (관리자도 수정 불가)
        if (!comment.getWriter().getUserId().equals(userId)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        comment.update(commentDTO.getCoComment());
        return toDTO(comment, userId, isAdmin);
    }

    // 댓글 삭제 (작성자 또는 관리자 가능)
    @Transactional
    public void delete(Long coNo, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(coNo)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        // 작성자이거나 관리자인 경우 삭제 가능
        boolean isWriter = comment.getWriter().getUserId().equals(userId);

        if (!isWriter && !isAdmin) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        comment.delete();
    }

    // 댓글 수 조회
    public long getCommentCount(Long boardNo) {
        return commentRepository.countByBoard_BoardNoAndDelYn(boardNo, "N");
    }

    // Entity -> DTO 변환 (비밀 댓글 권한 체크 포함)
    private CommentDTO toDTO(Comment comment, Long userId, boolean isAdmin) {
        CommentDTO dto = new CommentDTO();
        dto.setCoNo(comment.getCoNo());
        dto.setBoardNo(comment.getBoard().getBoardNo());
        dto.setWriterId(comment.getWriter().getUserId());
        dto.setWriterName(comment.getWriter().getUsername());
        dto.setDelYn(comment.getDelYn());
        dto.setCoRegDate(comment.getCoRegDate());
        dto.setCoModDate(comment.getCoModDate());
        dto.setSecretYn(comment.getSecretYn());

        // 비밀 댓글 내용 처리: 댓글 작성자, 게시글 작성자, 관리자만 내용 표시
        if ("Y".equals(comment.getSecretYn())) {
            boolean isCommentWriter = userId != null && comment.getWriter().getUserId().equals(userId);
            boolean isBoardWriter = userId != null &&
                                    comment.getBoard().getWriter() != null &&
                                    comment.getBoard().getWriter().getUserId().equals(userId);

            if (isCommentWriter || isBoardWriter || isAdmin) {
                dto.setCoComment(comment.getCoComment());  // 내용 표시
            } else {
                dto.setCoComment("비밀 댓글입니다.");       // 내용 숨김
            }
        } else {
            dto.setCoComment(comment.getCoComment()); // 일반 댓글은 내용 그대로 표시
        }
        return dto;
    }
}
