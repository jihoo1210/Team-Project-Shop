package com.example.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.dto.item.IndexItemRequest;
import com.example.backend.dto.item.IndexItemResponse;
import com.example.backend.dto.item.ShowItemResponse;
import com.example.backend.entity.user.User;
import com.example.backend.service.ItemService;
import com.example.backend.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


/**
 * 원인: SpringSecurity의 @AuthenticationPrincipal 어노테이션을 사용하여
 * CustomUserDetails를 컨트롤러 메서드의 매개변수로 주입할 때 발생하는 문제입니다.
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/item")
public class ItemController {

    private final ItemService itemService;
    private final UserService userService;

    /**
     * 아이템 목록 조회
     * @param customUserDetails 
     * @param pageable
     * @param searchParams
     * @return ResponseEntity<?>
     */
    @GetMapping
    public ResponseEntity<?> indexItem(@PageableDefault(size = 10, sort = "id", direction = Direction.DESC) org.springframework.data.domain.Pageable pageable,
                            IndexItemRequest searchParams) {
        try {
            // customUserDetails가 null일 경우 예외 발생 가능
            String searchField = searchParams.getSearchField();
            String searchTerm = searchParams.getSearchTerm();
            String majorCategory = searchParams.getMajorCategory();
            String middleCategory = searchParams.getMiddleCategory();
            String subcategory = searchParams.getSubcategory();
            User user = userService.checkLoginAndGetUser();
            // customUserDetails null 체크 필요
            Page<IndexItemResponse> response = itemService.indexItem(pageable, searchField, searchTerm, majorCategory, middleCategory, subcategory, user);
            return ResponseController.success(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }

    /**
     * 즐겨찾기 아이템 목록 조회
     * @param customUserDetails
     * @param pageable
     * @param searchParams
     * @return ResponseEntity<?>
     */
    @GetMapping("/favorite")
    public ResponseEntity<?> indexFavorite(@PageableDefault(size = 10, sort = "id", direction = Direction.DESC) org.springframework.data.domain.Pageable pageable,
                            IndexItemRequest searchParams) {
        try {

            User user = (User) userService.checkLoginAndGetUser();

            // indexFavorite 메서드가 실제 ItemService에 정의되어 있는지 확인 필요
            Page<IndexItemResponse> response = itemService.indexFavorite(pageable, searchParams, user);
            // 응답 객체가 null일 경우 빈 리스트 반환 등 처리 필요
            return ResponseController.success(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }

    @GetMapping("/cart")
    public ResponseEntity<?> indexCart(@PageableDefault(size = 10, sort = "id", direction = Direction.DESC) org.springframework.data.domain.Pageable pageable,
                            IndexItemRequest searchParams) {
        try {
            // customUserDetails가 null일 경우 NPE 발생 가능
            User user = userService.checkLoginAndGetUser();
            // indexCart 메서드가 실제 ItemService에 정의되어 있는지 확인 필요
            Page<IndexItemResponse> response = itemService.indexCart(pageable, searchParams, user);
            return ResponseController.success(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }
    

    /**
     * 아이템 상세 조회
     * @param customUserDetails
     * @param itemId
     * @return ResponseEntity<?>
     */
    @GetMapping("/{itemId}")
    public ResponseEntity<?> showItem(@PathVariable Long itemId) {
        try {
            User user = userService.checkLoginAndGetUser();
            ShowItemResponse item = itemService.getItemById(itemId, user);
            return ResponseController.success(item);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }

    /**
     * 즐겨찾기 토글
     * @param customUserDetails
     * @param itemId
     * @return
     */
    @PostMapping("/favorite/{itemId}")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long itemId) {
        try {
            User user = userService.checkLoginAndGetUser();
            itemService.toggleFavoriteItem(itemId, user);

            return ResponseController.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }
    
    /**
     * 장바구니 토글
     * @param customUserDetails
     * @param itemId
     * @return
     */
    @PostMapping("/cart/{itemId}")
    public ResponseEntity<?> toggleCart(@PathVariable Long itemId) {
        try {
            User user = userService.checkLoginAndGetUser();
            itemService.toggleCartItem(itemId, user);

            return ResponseController.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseController.fail(e);
        }
    }
    
    
}