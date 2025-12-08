package com.example.backend.service.search.utility;

import java.util.List;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class Filter {
    
    public static String clearSearchTermAndLikePattern(String searchTerm) {
        searchTerm = searchTerm.replace("\\s", "").toLowerCase();
        return "%" + searchTerm + "%";
    }

    public static List<Predicate> addCategoryPredicates(CriteriaBuilder builder, Root<?> root, List<Predicate> predicates, String majorCategory, String middleCategory, String subcategory) {
        if (majorCategory != null && !majorCategory.isEmpty()) {
            predicates.add(builder.equal(root.get("majorCategory"), majorCategory));
        }
        if (middleCategory != null && !middleCategory.isEmpty()) {
            predicates.add(builder.equal(root.get("middleCategory"), middleCategory));
        }
        if (subcategory != null && !subcategory.isEmpty()) {
            predicates.add(builder.equal(root.get("subcategory"), subcategory));
        }
        return predicates;
    }

    public static List<Predicate> addSearchFieldPredicates(CriteriaBuilder builder, Root<?> root, List<Predicate> predicates, String searchField, String pattern) {
        switch (searchField) {
            case "1":
                predicates.add(builder.like(root.get("field1"), pattern));
                break;
        
            default:
                break;
        }
        return predicates;
    }
}
