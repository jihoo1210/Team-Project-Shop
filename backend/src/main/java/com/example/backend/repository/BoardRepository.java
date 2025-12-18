package com.example.backend.repository;

import com.example.backend.entity.board.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    // 삭제되지 않은 게시글 목록 조회 (페이징)
    Page<Board> findByDelYnOrderByBoardNoDesc(String delYn, Pageable pageable);

    // 카테고리별 목록 조회
    Page<Board> findByDelYnAndBoardCategoryOrderByBoardNoDesc(String delYn, String boardCategory, Pageable pageable);

    // 키워드 검색 (제목 또는 내용)
    @Query("SELECT b FROM Board b WHERE b.delYn = 'N' AND (b.title LIKE %:keyword% OR b.content LIKE %:keyword%) ORDER BY b.boardNo DESC")
    Page<Board> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 카테고리 + 키워드 검색
    @Query("SELECT b FROM Board b WHERE b.delYn = 'N' AND b.boardCategory = :category AND (b.title LIKE %:keyword% OR b.content LIKE %:keyword%) ORDER BY b.boardNo DESC")
    Page<Board> searchByCategoryAndKeyword(@Param("category") String category, @Param("keyword") String keyword, Pageable pageable);

    // 조회수 증가
    @Modifying
    @Query("UPDATE Board b SET b.views = b.views + 1 WHERE b.boardNo = :boardNo")
    void increaseViews(@Param("boardNo") Long boardNo);
}
