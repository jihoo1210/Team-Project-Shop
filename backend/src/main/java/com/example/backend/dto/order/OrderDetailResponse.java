package com.example.backend.dto.order;

import java.util.List;

import com.example.backend.entity.item.Item;

import jakarta.persistence.criteria.CriteriaBuilder.In;
import lombok.Builder;
import lombok.Value;

@Builder
@Value
public class OrderDetailResponse {
    List<Item> items;
    Integer totalPrice;
    String addr;
    String call;
    String username;
    String zipcode;
}
