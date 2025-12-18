package com.example.backend.repository;

import com.example.backend.entity.board.BoardFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardFileRepository extends JpaRepository<BoardFile, Long> {

    // 게시글 번호로 파일 목록 조회
    List<BoardFile> findByBoard_BoardNo(Long boardNo);
}


