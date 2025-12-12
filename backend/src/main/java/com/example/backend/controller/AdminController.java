package com.example.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.dto.admin.ItemResistraionRequest;
import com.example.backend.service.AdminService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    /**
     * Save Item
     * @param dto
     * @param mainImage
     * @param images
     * @return
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveItem(
            @RequestPart("data") ItemResistraionRequest dto,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            adminService.saveItem(dto, mainImage, images);
            return ResponseController.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }

    /**
     * Update Item
     * @param itemId
     * @param dto
     * @param mainImage
     * @param images
     * @return
     */
    @PutMapping(value = "/{itemId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateItem(
            @PathVariable Long itemId,
            @RequestPart("data") ItemResistraionRequest dto,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            adminService.updateItem(itemId, dto, mainImage, images);
            return ResponseController.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }
    

    /**
     * Delete Item
     * @param itemId
     * @return
     */
    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteItem(@PathVariable Long itemId) {
        try {
            adminService.deleteItem(itemId);
            return ResponseController.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }
}
