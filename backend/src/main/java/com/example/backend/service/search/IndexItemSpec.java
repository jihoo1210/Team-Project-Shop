package com.example.backend.service.search;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.utility.CartItem;
import com.example.backend.entity.item.utility.FavoriteItem;
import com.example.backend.service.search.utility.Filter;

import jakarta.persistence.criteria.Predicate;

public class IndexItemSpec {

    public static Specification<Item> search(String searchField, String searchTerm, String majorCategory, String middleCategory, String subcategory, List<String> colors, List<String> sizes, Integer maxPrice) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            String pattern = "";
            if (searchTerm != null && !searchTerm.isEmpty()) {
                String clearSearchTerm = searchTerm.replace("\\s", "").toLowerCase();
                pattern = "%" + clearSearchTerm + "%";
                Filter.addSearchFieldPredicates(builder, root, predicates, searchField, pattern);
            }

            Filter.addCategoryPredicates(builder, root, predicates, majorCategory, middleCategory, subcategory);
            Filter.addColorPredicate(builder, root, predicates, colors);
            Filter.addSizePredicate(builder, root, predicates, sizes);
            Filter.addPricePredicate(builder, root, predicates, maxPrice);

            query.distinct(true);
            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<FavoriteItem> searchFavorites(String searchField, String searchTerm, String majorCategory, String middleCategory, String subcategory, List<String> colors, List<String> sizes, Integer maxPrice) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (searchTerm != null && !searchTerm.isEmpty()) {
                String clearSearchTerm = searchTerm.replace("\\s", "").toLowerCase();
                String pattern = "%" + clearSearchTerm + "%";
                Filter.addSearchFieldPredicates(builder, root, predicates, searchField, pattern);
            }

            Filter.addCategoryPredicates(builder, root, predicates, majorCategory, middleCategory, subcategory);
            Filter.addColorPredicate(builder, root, predicates, colors);
            Filter.addSizePredicate(builder, root, predicates, sizes);
            Filter.addPricePredicate(builder, root, predicates, maxPrice);

            query.distinct(true);
            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<CartItem> searchCart(String searchField, String searchTerm, String majorCategory, String middleCategory, String subcategory, List<String> colors, List<String> sizes, Integer maxPrice) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (searchTerm != null && !searchTerm.isEmpty()) {
                String clearSearchTerm = searchTerm.replace("\\s", "").toLowerCase();
                String pattern = "%" + clearSearchTerm + "%";
                Filter.addSearchFieldPredicates(builder, root, predicates, searchField, pattern);
            }

            Filter.addCategoryPredicates(builder, root, predicates, majorCategory, middleCategory, subcategory);
            Filter.addColorPredicate(builder, root, predicates, colors);
            Filter.addSizePredicate(builder, root, predicates, sizes);
            Filter.addPricePredicate(builder, root, predicates, maxPrice);

            query.distinct(true);
            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

