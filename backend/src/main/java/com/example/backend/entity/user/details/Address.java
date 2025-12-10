package com.example.backend.entity.user.details;

import com.example.backend.entity.user.User;
import com.example.backend.entity.utility.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "address")
public class Address extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "addr_no")
    private Long addrNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "addr_name", length = 50, nullable = false)
    private String addrName;  // 배송지명 (예: 집, 회사)

    @Column(name = "receiver_name", length = 50, nullable = false)
    private String receiverName;  // 수령인 이름

    @Column(name = "receiver_phone", length = 20, nullable = false)
    private String receiverPhone;  // 수령인 연락처

    @Column(length = 10, nullable = false)
    private String zipcode;  // 우편번호

    @Column(length = 255, nullable = false)
    private String address;  // 기본 주소

    @Column(name = "addr_detail", length = 255)
    private String addrDetail;  // 상세 주소

    @Column(name = "is_default", length = 1, nullable = false)
    @Builder.Default
    private String isDefault = "N";  // 기본 배송지 여부 (Y/N)

    // 배송지 정보 수정
    public void update(String addrName, String receiverName, String receiverPhone,
                       String zipcode, String address, String addrDetail) {
        this.addrName = addrName;
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.zipcode = zipcode;
        this.address = address;
        this.addrDetail = addrDetail;
    }

    // 기본 배송지 설정
    public void setAsDefault() {
        this.isDefault = "Y";
    }

    // 기본 배송지 해제
    public void unsetDefault() {
        this.isDefault = "N";
    }
}
