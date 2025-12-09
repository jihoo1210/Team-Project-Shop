package com.example.backend.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class AddressDTO{
    
    private int addrNo;
    private int userNo;
    
    private String addrName;      // 배송지명 (집, 회사 등)
    private String receiverName;  // 수령인
    private String receiverPhone; // 수령인 연락처
    
    private String zipcode;
    private String address;
    private String addrDetail;
    
    private String isDefault;     // "Y" or "N"
}
