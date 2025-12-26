package com.example.backend.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.dto.banner.BannerRequest;
import com.example.backend.dto.banner.BannerResponse;
import com.example.backend.service.BannerService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/banner")
public class BannerController {

    private final BannerService bannerService;

    /**
     * 활성화된 배너 목록 조회 (비회원 접근 가능)
     */
    @GetMapping
    public ResponseEntity<?> getActiveBanners() {
        try {
            List<BannerResponse> banners = bannerService.getActiveBanners();
            return ResponseController.success(banners);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }

    /**
     * 전체 배너 목록 조회 (관리자용)
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllBanners() {
        try {
            List<BannerResponse> banners = bannerService.getAllBanners();
            return ResponseController.success(banners);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }

    /**
     * 배너 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBannerById(@PathVariable("id") Long id) {
        try {
            BannerResponse banner = bannerService.getBannerById(id);
            return ResponseController.success(banner);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }

    /**
     * 배너 생성 (관리자용)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBanner(
            @RequestPart("data") BannerRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            BannerResponse banner = bannerService.createBanner(request, image);
            return ResponseController.success(banner);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }

    /**
     * 배너 수정 (관리자용)
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBanner(
            @PathVariable("id") Long id,
            @RequestPart("data") BannerRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            BannerResponse banner = bannerService.updateBanner(id, request, image);
            return ResponseController.success(banner);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }

    /**
     * 배너 삭제 (관리자용)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBanner(@PathVariable("id") Long id) {
        try {
            bannerService.deleteBanner(id);
            return ResponseController.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }
}
