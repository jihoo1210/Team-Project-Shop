package com.example.backend.entity.item.utility;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.enums.ColorEnum;
import com.example.backend.entity.item.enums.SizeEnum;
import com.example.backend.entity.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

@Entity
public class CartItem {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Item item;
    @ManyToOne
    private User user;

    @Enumerated(EnumType.STRING)
    private ColorEnum color;

    @Enumerated(EnumType.STRING)
    private SizeEnum size;

    @Column
    private Integer number;
}
