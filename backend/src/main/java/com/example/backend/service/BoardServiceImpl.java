package com.example.backend.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.BoardDTO;
import com.example.backend.dto.BoardFileDTO;
import com.example.backend.entity.board.Board;
import com.example.backend.entity.board.BoardFile;
import com.example.backend.entity.user.User;
import com.example.backend.repository.BoardRepository;
import com.example.backend.repository.BoardFileRepository;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class BoardServiceImpl {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardFileRepository boardFileRepository;

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
                .map(board -> toDTO(board))
                .toList();

        Map<String, Object> map = new HashMap<>();
        map.put("list", list);
        map.put("totalPages", boardPage.getTotalPages());
        map.put("totalElements", boardPage.getTotalElements());
        map.put("currentPage", page);
        return map;
    }

    // 글쓰기 (다중 파일 업로드 지원)
    @Transactional
    public void write(BoardDTO boardDTO, List<MultipartFile> files, Long userId) throws Exception {
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

        // 2. 파일들 있으면 저장
        if (files != null && !files.isEmpty()) {
            File dir = new File(UPLOAD_PATH);
            if (!dir.exists()) dir.mkdirs();

            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

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
    }

    // 상세 조회 (비밀글 권한 체크 포함)
    @Transactional
    public BoardDTO getBoard(Long boardNo, Long userId, boolean isAdmin) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if ("Y".equals(board.getDelYn())) {
            throw new IllegalArgumentException("삭제된 게시글입니다.");
        }

        // 비밀글 권한 체크: 관리자이거나 작성자만 조회 가능
        if ("Y".equals(board.getSecretYn())) {
            boolean isWriter = board.getWriter() != null &&
                               userId != null &&
                               board.getWriter().getUserId().equals(userId);

            if (!isAdmin && !isWriter) {
                throw new IllegalArgumentException("비밀글은 작성자만 확인할 수 있습니다.");
            }
        }

        // 조회수 증가
        boardRepository.increaseViews(boardNo);

        return toDTO(board);
    }

    // 글 수정 (작성자만 가능)
    @Transactional
    public void update(Long boardNo, BoardDTO boardDTO, Long userId) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 작성자 확인 (관리자도 수정 불가)
        if (!board.getWriter().getUserId().equals(userId)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        board.update(boardDTO.getTitle(), boardDTO.getContent(), 
                     boardDTO.getBoardCategory(), boardDTO.getSecretYn());
    }

    // 글 삭제 (작성자 또는 관리자 가능)
    @Transactional
    public void delete(Long boardNo, Long userId, boolean isAdmin) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 작성자이거나 관리자인 경우 삭제 가능
        boolean isWriter = board.getWriter().getUserId().equals(userId);

        if (!isWriter && !isAdmin) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        board.delete();
    }

    // 파일 다운로드
    public Resource downloadFile(Long fileNo) throws IOException {
        BoardFile boardFile = boardFileRepository.findById(fileNo)
                .orElseThrow(() -> new IllegalArgumentException("파일을 찾을 수 없습니다."));

        Path filePath = Paths.get(UPLOAD_PATH + boardFile.getSaveFilename());
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            throw new IllegalArgumentException("파일이 존재하지 않습니다.");
        }

        return resource;
    }

    // 파일 정보 조회
    public BoardFileDTO getFileInfo(Long fileNo) {
        BoardFile boardFile = boardFileRepository.findById(fileNo)
                .orElseThrow(() -> new IllegalArgumentException("파일을 찾을 수 없습니다."));

        BoardFileDTO dto = new BoardFileDTO();
        dto.setFileNo(boardFile.getFileNo());
        dto.setBoardNo(boardFile.getBoard().getBoardNo());
        dto.setOriginFilename(boardFile.getOriginFilename());
        dto.setSaveFilename(boardFile.getSaveFilename());
        dto.setFileSize(boardFile.getFileSize());
        dto.setFileExt(boardFile.getFileExt());
        dto.setRegDate(boardFile.getRegDate());
        return dto;
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
        // 첨부파일 목록
        List<BoardFileDTO> files = board.getFiles().stream()
                .map(this::toFileDTO)
                .collect(Collectors.toList());
        dto.setFiles(files);
        return dto;
    }

    // BoardFile Entity -> DTO 변환
    private BoardFileDTO toFileDTO(BoardFile file) {
        BoardFileDTO dto = new BoardFileDTO();
        dto.setFileNo(file.getFileNo());
        dto.setBoardNo(file.getBoard().getBoardNo());
        dto.setOriginFilename(file.getOriginFilename());
        dto.setSaveFilename(file.getSaveFilename());
        dto.setFileSize(file.getFileSize());
        dto.setFileExt(file.getFileExt());
        dto.setRegDate(file.getRegDate());
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
