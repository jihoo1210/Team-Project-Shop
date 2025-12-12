package com.example.backend.service.search.utility;

import java.util.List;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class Filter {

    public static <T> void addSearchFieldPredicates(CriteriaBuilder builder, Root<T> root, List<Predicate> predicates, String searchField, String pattern) {
        if (searchField == null || searchField.isEmpty()) {
            // 기본적으로 title 필드에서 검색
            Path<String> titlePath = getItemPath(root, "title");
            predicates.add(builder.like(builder.lower(titlePath), pattern));
        } else {
            switch (searchField) {
                case "title":
                    Path<String> titlePath = getItemPath(root, "title");
                    predicates.add(builder.like(builder.lower(titlePath), pattern));
                    break;
                case "brand":
                    Path<String> brandPath = getItemPath(root, "brand");
                    predicates.add(builder.like(builder.lower(brandPath), pattern));
                    break;
                case "description":
                    Path<String> descPath = getItemPath(root, "description");
                    predicates.add(builder.like(builder.lower(descPath), pattern));
                    break;
                default:
                    Path<String> defaultPath = getItemPath(root, "title");
                    predicates.add(builder.like(builder.lower(defaultPath), pattern));
                    break;
            }
        }
    }

    public static <T> void addCategoryPredicates(CriteriaBuilder builder, Root<T> root, List<Predicate> predicates, String majorCategory, String middleCategory, String subcategory) {
        if (majorCategory != null && !majorCategory.isEmpty()) {
            Path<String> majorPath = getItemPath(root, "majorCategory");
            predicates.add(builder.equal(majorPath, majorCategory));
        }
        if (middleCategory != null && !middleCategory.isEmpty()) {
            Path<String> middlePath = getItemPath(root, "middleCategory");
            predicates.add(builder.equal(middlePath, middleCategory));
        }
        if (subcategory != null && !subcategory.isEmpty()) {
            Path<String> subPath = getItemPath(root, "subcategory");
            predicates.add(builder.equal(subPath, subcategory));
        }
    }

    public static <T> void addColorPredicate(CriteriaBuilder builder, Root<T> root, List<Predicate> predicates, List<String> colors) {
        if (colors != null && !colors.isEmpty()) {
            Join<?, ?> colorJoin = getItemJoin(root, "colorList");
            // 여러 색상 중 하나라도 매칭되면 조회 (OR 조건)
            Predicate[] colorPredicates = colors.stream()
                    .map(color -> builder.equal(colorJoin.get("color"), color))
                    .toArray(Predicate[]::new);
            predicates.add(builder.or(colorPredicates));
        }
    }

    public static <T> void addSizePredicate(CriteriaBuilder builder, Root<T> root, List<Predicate> predicates, List<String> sizes) {
        if (sizes != null && !sizes.isEmpty()) {
            Join<?, ?> sizeJoin = getItemJoin(root, "sizeList");
            // 여러 사이즈 중 하나라도 매칭되면 조회 (OR 조건)
            Predicate[] sizePredicates = sizes.stream()
                    .map(size -> builder.equal(sizeJoin.get("size"), size))
                    .toArray(Predicate[]::new);
            predicates.add(builder.or(sizePredicates));
        }
    }

    public static <T> void addPricePredicate(CriteriaBuilder builder, Root<T> root, List<Predicate> predicates, Integer maxPrice) {
        if (maxPrice != null && maxPrice > 0) {
            Path<Integer> pricePath = getItemPath(root, "price");
            predicates.add(builder.lessThanOrEqualTo(pricePath, maxPrice));
        }
    }

    @SuppressWarnings("unchecked")
    private static <T, Y> Path<Y> getItemPath(Root<T> root, String field) {
        // FavoriteItem, CartItem 등의 경우 item을 통해 접근
        try {
            return (Path<Y>) root.get("item").get(field);
        } catch (IllegalArgumentException e) {
            // Item 엔티티인 경우 직접 접근
            return (Path<Y>) root.get(field);
        }
    }

    @SuppressWarnings("unchecked")
    private static <T> Join<?, ?> getItemJoin(Root<T> root, String collection) {
        // FavoriteItem, CartItem 등의 경우 item을 통해 접근
        try {
            return root.join("item", JoinType.LEFT).join(collection, JoinType.LEFT);
        } catch (IllegalArgumentException e) {
            // Item 엔티티인 경우 직접 접근
            return root.join(collection, JoinType.LEFT);
        }
    }
}
