package com.example.backend.service.search;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.utility.CartItem;
import com.example.backend.entity.item.utility.FavoriteItem;
import com.example.backend.entity.user.User;
import com.example.backend.service.search.utility.Filter;

import jakarta.persistence.criteria.Predicate;

public class IndexItemSpec {

    public static Specification<Item> search(String searchField, String searchTerm, String majorCategory, String middleCategory, String subcategory, List<String> colors, List<String> sizes, Integer minPrice, Integer maxPrice) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            String pattern = "";
            if (searchTerm != null && !searchTerm.isEmpty()) {
                String clearSearchTerm = searchTerm.replaceAll("\\s", "").toLowerCase();
                pattern = "%" + clearSearchTerm + "%";
                Filter.addSearchFieldPredicates(builder, root, predicates, searchField, pattern);
            }

            Filter.addCategoryPredicates(builder, root, predicates, majorCategory, middleCategory, subcategory);
            Filter.addColorPredicate(builder, root, predicates, colors);
            Filter.addSizePredicate(builder, root, predicates, sizes);
            Filter.addPricePredicate(builder, root, predicates, minPrice, maxPrice);

            query.distinct(true);
            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<FavoriteItem> searchFavorites(String searchField, String searchTerm, String majorCategory, String middleCategory, String subcategory, List<String> colors, List<String> sizes, Integer minPrice, Integer maxPrice, User user) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 현재 로그인한 사용자의 즐겨찾기만 조회
            if (user != null) {
                predicates.add(builder.equal(root.get("user").get("userId"), user.getUserId()));
            }

            if (searchTerm != null && !searchTerm.isEmpty()) {
                String clearSearchTerm = searchTerm.replaceAll("\\s", "").toLowerCase();
                String pattern = "%" + clearSearchTerm + "%";
                Filter.addSearchFieldPredicates(builder, root, predicates, searchField, pattern);
            }

            Filter.addCategoryPredicates(builder, root, predicates, majorCategory, middleCategory, subcategory);
            Filter.addColorPredicate(builder, root, predicates, colors);
            Filter.addSizePredicate(builder, root, predicates, sizes);
            Filter.addPricePredicate(builder, root, predicates, minPrice, maxPrice);

            query.distinct(true);
            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<CartItem> searchCart(String searchField, String searchTerm, String majorCategory, String middleCategory, String subcategory, List<String> colors, List<String> sizes, Integer minPrice, Integer maxPrice, User user) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 현재 로그인한 사용자의 장바구니만 조회
            if (user != null) {
                predicates.add(builder.equal(root.get("user").get("userId"), user.getUserId()));
            }

            if (searchTerm != null && !searchTerm.isEmpty()) {
                String clearSearchTerm = searchTerm.replaceAll("\\s", "").toLowerCase();
                String pattern = "%" + clearSearchTerm + "%";
                Filter.addSearchFieldPredicates(builder, root, predicates, searchField, pattern);
            }

            Filter.addCategoryPredicates(builder, root, predicates, majorCategory, middleCategory, subcategory);
            Filter.addColorPredicate(builder, root, predicates, colors);
            Filter.addSizePredicate(builder, root, predicates, sizes);
            Filter.addPricePredicate(builder, root, predicates, minPrice, maxPrice);

            query.distinct(true);
            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

