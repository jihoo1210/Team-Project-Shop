package com.example.backend.dto.address;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {

    private String addrName;       // 배송지명 (예: 집, 회사)
    private String receiverName;   // 수령인 이름
    private String receiverPhone;  // 수령인 연락처
    private String zipcode;        // 우편번호
    private String address;        // 기본 주소
    private String addrDetail;     // 상세 주소
}
