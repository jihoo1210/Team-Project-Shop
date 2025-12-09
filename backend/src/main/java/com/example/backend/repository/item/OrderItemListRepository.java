package com.example.backend.repository.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.item.utility.OrderItemList;

@Repository
public interface OrderItemListRepository extends JpaRepository<OrderItemList, Long>{
    
}
