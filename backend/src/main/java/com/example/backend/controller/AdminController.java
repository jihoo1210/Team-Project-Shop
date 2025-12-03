package com.example.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.dto.admin.ItemResistraionRequest;
import com.example.backend.service.AdminService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    /**
     * Save Item
     * @param dto
     * @return
     */
    @PostMapping
    public ResponseEntity<?> saveItem(@RequestBody ItemResistraionRequest dto) {
        try {
            adminService.saveItem(dto);
            return ResponseController.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.error(e);
        }
    }
    
    /**
     * Update Item
     * @param itemId
     * @param dto
     * @return
     */
    @PutMapping("/{itemId}")
    public ResponseEntity<?> putMethodName(@PathVariable Long itemId, @RequestBody ItemResistraionRequest dto) {
        try {
            adminService.updateItem(itemId, dto);
            return ResponseController.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.error(e);
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
            return ResponseController.error(e);
        }
    }
}
