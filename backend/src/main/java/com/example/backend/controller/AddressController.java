package com.example.backend.controller;

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.dto.address.AddressRequest;
import com.example.backend.dto.address.AddressResponse;
import com.example.backend.entity.user.User;
import com.example.backend.service.AddressService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final UserService userService;
    private final AddressService addressService;

    // 내 배송지 목록 조회
    @GetMapping
    public ResponseEntity<?> getMyAddresses() {
        try {
            User user = userService.checkLoginAndGetUser();
            List<AddressResponse> addresses = addressService.getMyAddresses(user);
            return ResponseController.success(addresses);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 배송지 추가
    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody AddressRequest request) {
        try {
            User user = userService.checkLoginAndGetUser();
            addressService.addAddress(request, user);
            return ResponseController.success(null);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 배송지 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable("id") Long addrNo,
                                           @RequestBody AddressRequest request) {
        try {
            User user = userService.checkLoginAndGetUser();
            addressService.updateAddress(addrNo, request, user);
            return ResponseController.success(null);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 배송지 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable("id") Long addrNo) {
        try {
            User user = userService.checkLoginAndGetUser();
            addressService.deleteAddress(addrNo, user);
            return ResponseController.success(null);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 기본 배송지 설정
    @PutMapping("/{id}/default")
    public ResponseEntity<?> setDefaultAddress(@PathVariable("id") Long addrNo) {
        try {
            User user = userService.checkLoginAndGetUser();
            addressService.setDefaultAddress(addrNo, user);
            return ResponseController.success(null);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }
}
