package com.example.backend.repository;

import com.example.backend.entity.comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 게시글 번호로 삭제되지 않은 댓글 목록 조회 (등록일 오름차순)
    List<Comment> findByBoard_BoardNoAndDelYnOrderByCoRegDateAsc(Long boardNo, String delYn);

    // 게시글 번호로 댓글 수 조회
    long countByBoard_BoardNoAndDelYn(Long boardNo, String delYn);
}


