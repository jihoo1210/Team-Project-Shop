package com.example.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.banner.BannerRequest;
import com.example.backend.dto.banner.BannerResponse;
import com.example.backend.entity.banner.Banner;
import com.example.backend.repository.BannerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class BannerService {

    @Value("${upload-dir}")
    private String IMAGE_UPLOAD_PATH;
    private static final String IMAGE_URL_PREFIX = "/banner/";

    private final BannerRepository bannerRepository;

    /**
     * 활성화된 배너 목록 조회 (사용자용)
     */
    public List<BannerResponse> getActiveBanners() {
        return bannerRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(BannerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 전체 배너 목록 조회 (관리자용)
     */
    public List<BannerResponse> getAllBanners() {
        return bannerRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(BannerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 배너 상세 조회
     */
    public BannerResponse getBannerById(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found with id: " + id));
        return BannerResponse.fromEntity(banner);
    }

    /**
     * 배너 생성
     */
    public BannerResponse createBanner(BannerRequest request, MultipartFile image) throws IOException {
        String imageUrl = saveImageFile(image);
        if (imageUrl == null) {
            imageUrl = request.getImageUrl();
        }

        if (imageUrl == null || imageUrl.isEmpty()) {
            throw new RuntimeException("Image is required for banner");
        }

        Banner banner = Banner.builder()
                .imageUrl(imageUrl)
                .title(request.getTitle())
                .linkUrl(request.getLinkUrl())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        Banner savedBanner = bannerRepository.save(banner);
        return BannerResponse.fromEntity(savedBanner);
    }

    /**
     * 배너 수정
     */
    public BannerResponse updateBanner(Long id, BannerRequest request, MultipartFile image) throws IOException {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found with id: " + id));

        String imageUrl = saveImageFile(image);
        if (imageUrl != null) {
            banner.setImageUrl(imageUrl);
        } else if (request.getImageUrl() != null) {
            banner.setImageUrl(request.getImageUrl());
        }

        if (request.getTitle() != null) {
            banner.setTitle(request.getTitle());
        }
        if (request.getLinkUrl() != null) {
            banner.setLinkUrl(request.getLinkUrl());
        }
        if (request.getDisplayOrder() != null) {
            banner.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getIsActive() != null) {
            banner.setIsActive(request.getIsActive());
        }

        Banner savedBanner = bannerRepository.save(banner);
        return BannerResponse.fromEntity(savedBanner);
    }

    /**
     * 배너 삭제
     */
    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found with id: " + id));
        bannerRepository.delete(banner);
    }

    /**
     * 이미지 파일 저장
     */
    private String saveImageFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        Path uploadPath = Paths.get(IMAGE_UPLOAD_PATH, "banner");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFilename = UUID.randomUUID().toString() + extension;

        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath);

        log.info("Banner image saved: {}", filePath.toString());

        return IMAGE_URL_PREFIX + newFilename;
    }
}
