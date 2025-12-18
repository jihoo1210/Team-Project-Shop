package com.example.backend.service;

import com.example.backend.dto.address.AddressRequest;
import com.example.backend.dto.address.AddressResponse;
import com.example.backend.entity.user.User;
import com.example.backend.entity.user.details.Address;
import com.example.backend.repository.AddressRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    // 내 배송지 목록 조회
    @Transactional(readOnly = true)
    public List<AddressResponse> getMyAddresses(User user) {
        User savedUser = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        List<Address> addresses = addressRepository.findByUserOrderByIsDefaultDescAddrNoDesc(savedUser);

        return addresses.stream()
                .map(AddressResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 배송지 추가
    @Transactional
    public void addAddress(AddressRequest request, User user) throws Exception {
        User savedUser = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        // 배송지 개수 제한 (최대 3개)
        long addressCount = addressRepository.countByUser(savedUser);
        if (addressCount >= 3) {
            throw new IllegalAccessException("배송지는 최대 3개까지 등록할 수 있습니다.");
        }

        // 첫 번째 배송지인 경우 기본 배송지로 설정
        boolean isFirstAddress = addressCount == 0;

        Address address = Address.builder()
                .user(savedUser)
                .addrName(request.getAddrName())
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .zipcode(request.getZipcode())
                .address(request.getAddress())
                .addrDetail(request.getAddrDetail())
                .isDefault(isFirstAddress ? "Y" : "N")
                .build();

        addressRepository.save(address);
    }

    // 배송지 수정
    @Transactional
    public void updateAddress(Long addrNo, AddressRequest request, User user) {
        User savedUser = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Address address = addressRepository.findByAddrNoAndUser(addrNo, savedUser)
                .orElseThrow(() -> new RuntimeException("배송지를 찾을 수 없습니다."));

        address.update(
                request.getAddrName(),
                request.getReceiverName(),
                request.getReceiverPhone(),
                request.getZipcode(),
                request.getAddress(),
                request.getAddrDetail()
        );
    }

    // 배송지 삭제
    @Transactional
    public void deleteAddress(Long addrNo, User user) {
        User savedUser = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Address address = addressRepository.findByAddrNoAndUser(addrNo, savedUser)
                .orElseThrow(() -> new RuntimeException("배송지를 찾을 수 없습니다."));

        boolean wasDefault = "Y".equals(address.getIsDefault());

        addressRepository.delete(address);

        // 삭제된 배송지가 기본 배송지였으면 다른 배송지를 기본으로 설정
        if (wasDefault) {
            List<Address> remainingAddresses = addressRepository.findByUserOrderByIsDefaultDescAddrNoDesc(savedUser);
            if (!remainingAddresses.isEmpty()) {
                remainingAddresses.get(0).setAsDefault();
            }
        }
    }

    // 기본 배송지 설정
    @Transactional
    public void setDefaultAddress(Long addrNo, User user) {
        User savedUser = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Address address = addressRepository.findByAddrNoAndUser(addrNo, savedUser)
                .orElseThrow(() -> new RuntimeException("배송지를 찾을 수 없습니다."));

        // 기존 기본 배송지 해제
        addressRepository.clearDefaultByUser(savedUser);

        // 새 기본 배송지 설정
        address.setAsDefault();
    }
}
