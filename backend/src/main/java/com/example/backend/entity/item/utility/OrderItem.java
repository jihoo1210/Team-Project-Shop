package com.example.backend.entity.item.utility;

import java.util.List;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.enums.ColorEnum;
import com.example.backend.entity.item.enums.SizeEnum;
import com.example.backend.entity.user.User;
import com.example.backend.entity.utility.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Value;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter

@Entity
public class OrderItem extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemList> itemList;

    @ManyToOne
    private User user;

    @Column
    private String addr;

    @Column
    private String call;

    @Column
    private String zipcode;

    @Column
    private Integer totalPrice;
}
