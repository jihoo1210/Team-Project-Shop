package com.example.backend.repository;

import com.example.backend.entity.user.User;
import com.example.backend.entity.user.details.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    // 사용자의 모든 배송지 조회 (기본 배송지 우선, 최신순)
    List<Address> findByUserOrderByIsDefaultDescAddrNoDesc(User user);

    // 사용자의 특정 배송지 조회
    Optional<Address> findByAddrNoAndUser(Long addrNo, User user);

    // 사용자의 기본 배송지 조회
    Optional<Address> findByUserAndIsDefault(User user, String isDefault);

    // 사용자의 모든 배송지 기본 배송지 해제
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = 'N' WHERE a.user = :user")
    void clearDefaultByUser(@Param("user") User user);

    // 사용자의 배송지 개수 조회
    long countByUser(User user);
}
