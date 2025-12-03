package com.example.backend.service;

import java.io.File;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.entity.board.Board;
import com.example.backend.entity.board.BoardFile;
import com.example.backend.entity.user.User;
import com.example.backend.repository.BoardRepository;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class BoardServiceImpl {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    private static final String UPLOAD_PATH = "C:\\shopping_upload\\";

    // 목록 조회
    public Map<String, Object> getList(int page, String category, String keyword) {
        int size = 10;
        Pageable pageable = PageRequest.of(page - 1, size);

        Page<Board> boardPage;

        if (keyword != null && !keyword.isEmpty()) {
            if (category != null && !category.isEmpty()) {
                boardPage = boardRepository.searchByCategoryAndKeyword(category, keyword, pageable);
            } else {
                boardPage = boardRepository.searchByKeyword(keyword, pageable);
            }
        } else if (category != null && !category.isEmpty()) {
            boardPage = boardRepository.findByDelYnAndBoardCategoryOrderByBoardNoDesc("N", category, pageable);
        } else {
            boardPage = boardRepository.findByDelYnOrderByBoardNoDesc("N", pageable);
        }

        // Entity -> DTO 변환
        var list = boardPage.getContent().stream()
                .map(this::toDTO)
                .toList();

        Map<String, Object> map = new HashMap<>();
        map.put("list", list);
        map.put("totalPages", boardPage.getTotalPages());
        map.put("totalElements", boardPage.getTotalElements());
        map.put("currentPage", page);
        return map;
    }

    // 글쓰기 (트랜잭션 필수)
    @Transactional
    public void write(BoardDTO boardDTO, MultipartFile file, Long userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Board board = Board.builder()
                .writer(user)
                .boardCategory(boardDTO.getBoardCategory())
                .title(boardDTO.getTitle())
                .content(boardDTO.getContent())
                .secretYn(boardDTO.getSecretYn())
                .build();

        boardRepository.save(board); // 1. 글 저장

        if (file != null && !file.isEmpty()) { // 2. 파일 있으면 저장
            File dir = new File(UPLOAD_PATH);
            if (!dir.exists()) dir.mkdirs();

            String uuid = UUID.randomUUID().toString();
            String saveName = uuid + "_" + file.getOriginalFilename();

            file.transferTo(new File(UPLOAD_PATH, saveName));

            BoardFile boardFile = BoardFile.builder()
                    .originFilename(file.getOriginalFilename())
                    .saveFilename(saveName)
                    .fileSize(file.getSize())
                    .fileExt(getFileExtension(file.getOriginalFilename()))
                    .build();

            board.addFile(boardFile); // 연관관계 설정 및 저장 (cascade)
        }
    }

    // 상세 조회
    @Transactional
    public BoardDTO getBoard(Long boardNo) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if ("Y".equals(board.getDelYn())) {
            throw new IllegalArgumentException("삭제된 게시글입니다.");
        }

        // 조회수 증가
        boardRepository.increaseViews(boardNo);

        return toDTO(board);
    }

    // 글 수정
    @Transactional
    public void update(Long boardNo, BoardDTO boardDTO, Long userId) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 작성자 확인
        if (!board.getWriter().getUserId().equals(userId)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        board.update(boardDTO.getTitle(), boardDTO.getContent(), 
                     boardDTO.getBoardCategory(), boardDTO.getSecretYn());
    }

    // 글 삭제 (소프트 삭제)
    @Transactional
    public void delete(Long boardNo, Long userId) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 작성자 확인
        if (!board.getWriter().getUserId().equals(userId)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        board.delete();
    }

    // Entity -> DTO 변환
    private BoardDTO toDTO(Board board) {
        BoardDTO dto = new BoardDTO();
        dto.setBoardNo(board.getBoardNo());
        dto.setWriterId(board.getWriter() != null ? board.getWriter().getUserId() : null);
        dto.setWriterName(board.getWriter() != null ? board.getWriter().getUsername() : null);
        dto.setBoardCategory(board.getBoardCategory());
        dto.setTitle(board.getTitle());
        dto.setContent(board.getContent());
        dto.setViews(board.getViews());
        dto.setSecretYn(board.getSecretYn());
        dto.setDelYn(board.getDelYn());
        dto.setRegDate(board.getRegDate());
        dto.setModDate(board.getModDate());
        // 댓글 수 조회
        dto.setCommentCount(commentRepository.countByBoard_BoardNoAndDelYn(board.getBoardNo(), "N"));
        return dto;
    }

    // 파일 확장자 추출
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
