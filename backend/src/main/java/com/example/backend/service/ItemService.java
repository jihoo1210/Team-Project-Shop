package com.example.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

import com.example.backend.dto.item.IndexItemRequest;
import com.example.backend.dto.item.IndexItemResponse;
import com.example.backend.dto.item.ShowItemResponse;
import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.utility.CartItem;
import com.example.backend.entity.item.utility.FavoriteItem;
import com.example.backend.entity.user.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.item.CartItemRepository;
import com.example.backend.repository.item.FavoriteItemRepository;
import com.example.backend.repository.item.ItemRepository;
import com.example.backend.service.search.IndexItemSpec;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final FavoriteItemRepository favoriteItemRepository;
    private final CartItemRepository cartItemRepository;
    
    private final UserRepository userRepository;

    private <T> Page<IndexItemResponse> getIndexPage(
            Pageable pageable,
            String searchField,
            String searchTerm,
            String majorCategory,
            String middleCategory,
            String subcategory,
            User user,
            Specification<T> spec,
            org.springframework.data.jpa.repository.JpaSpecificationExecutor<T> repository,
            java.util.function.Function<T, Item> itemExtractor
    ) {
        Page<T> itemPage = repository.findAll(spec, pageable);
        return itemPage.map(entity -> {
            Item item = itemExtractor.apply(entity);
            return IndexItemResponse.fromEntity(item,
                    favoriteItemRepository.existsByItemAndUser(item, user),
                    cartItemRepository.existsByItemAndUser(item, user));
        });
    }

    public Page<IndexItemResponse> indexItem(Pageable pageable, String searchField, String searchTerm, String majorCategory, String middleCategory, String subcategory, List<String> colors, List<String> sizes, Integer maxPrice, User user) {
        Specification<Item> spec = IndexItemSpec.search(searchField, searchTerm, majorCategory, middleCategory, subcategory, colors, sizes, maxPrice);
        return getIndexPage(pageable, searchField, searchTerm, majorCategory, middleCategory, subcategory, user, spec, itemRepository, item -> item);
    }

    public Page<IndexItemResponse> indexFavorite(Pageable pageable, IndexItemRequest searchParams, User user) {
        Specification<FavoriteItem> spec = IndexItemSpec.searchFavorites(
            searchParams.getSearchField(), searchParams.getSearchTerm(),
            searchParams.getMajorCategory(), searchParams.getMiddleCategory(), searchParams.getSubcategory(),
            searchParams.getColors(), searchParams.getItemSizes(), searchParams.getMaxPrice());
        return getIndexPage(pageable, searchParams.getSearchField(), searchParams.getSearchTerm(),
            searchParams.getMajorCategory(), searchParams.getMiddleCategory(), searchParams.getSubcategory(),
            user, spec, favoriteItemRepository, favoriteItem -> favoriteItem.getItem());
    }

    public Page<IndexItemResponse> indexCart(Pageable pageable, IndexItemRequest searchParams, User user) {
        Specification<CartItem> spec = IndexItemSpec.searchCart(
            searchParams.getSearchField(), searchParams.getSearchTerm(),
            searchParams.getMajorCategory(), searchParams.getMiddleCategory(), searchParams.getSubcategory(),
            searchParams.getColors(), searchParams.getItemSizes(), searchParams.getMaxPrice());
        return getIndexPage(pageable, searchParams.getSearchField(), searchParams.getSearchTerm(),
            searchParams.getMajorCategory(), searchParams.getMiddleCategory(), searchParams.getSubcategory(),
            user, spec, cartItemRepository, cartItem -> cartItem.getItem());
    }

    public ShowItemResponse getItemById(Long itemId, User user) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemId));
        return ShowItemResponse.fromEntity(item,
                 favoriteItemRepository.existsByItemAndUser(item, user),
                 cartItemRepository.existsByItemAndUser(item, user));
    }

    public void toggleFavoriteItem(Long itemId, User user) {
        User savedUser = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + user.getUserId()));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemId));

        boolean exists = favoriteItemRepository.existsByItemAndUser(item, savedUser);
        if (exists) {
            FavoriteItem favoriteItem = favoriteItemRepository.findByItemAndUser(item, savedUser)
                    .orElseThrow(() -> new RuntimeException("FavoriteItem not found for item id: " + itemId + " and user id: " + savedUser.getUserId()));
            favoriteItemRepository.delete(favoriteItem);
        } else {
            FavoriteItem favoriteItem = new FavoriteItem();
            favoriteItem.setItem(item);
            favoriteItem.setUser(user);
            favoriteItemRepository.save(favoriteItem);
        }
    }

    public void toggleCartItem(Long itemId, User user) {
        User savedUser = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + user.getUserId()));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemId));

        boolean exists = cartItemRepository.existsByItemAndUser(item, savedUser);
        if (exists) {
            cartItemRepository.deleteByItemAndUser(item, savedUser);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setItem(item);
            cartItem.setUser(savedUser);
            cartItem.setNumber(1);
            cartItemRepository.save(cartItem);
        }
    }
}
