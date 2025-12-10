package com.example.backend.dto.address;

import com.example.backend.entity.user.details.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {

    private Long addrNo;
    private String addrName;
    private String receiverName;
    private String receiverPhone;
    private String zipcode;
    private String address;
    private String addrDetail;
    private String isDefault;

    public static AddressResponse fromEntity(Address address) {
        return AddressResponse.builder()
                .addrNo(address.getAddrNo())
                .addrName(address.getAddrName())
                .receiverName(address.getReceiverName())
                .receiverPhone(address.getReceiverPhone())
                .zipcode(address.getZipcode())
                .address(address.getAddress())
                .addrDetail(address.getAddrDetail())
                .isDefault(address.getIsDefault())
                .build();
    }
}
