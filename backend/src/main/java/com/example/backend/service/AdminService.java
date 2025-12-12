package com.example.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.admin.ItemResistraionRequest;
import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.details.Color;
import com.example.backend.entity.item.details.ItemImage;
import com.example.backend.entity.item.details.Size;
import com.example.backend.entity.item.enums.ColorEnum;
import com.example.backend.entity.item.enums.MajorCategoryEnum;
import com.example.backend.entity.item.enums.MiddleCategoryEnum;
import com.example.backend.entity.item.enums.SizeEnum;
import com.example.backend.entity.item.enums.SubcategoryEnum;
import com.example.backend.repository.item.ColorRepostitory;
import com.example.backend.repository.item.ItemImageRepository;
import com.example.backend.repository.item.ItemRepository;
import com.example.backend.repository.item.SizeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class AdminService {

    @Value("${upload-dir}")
    private String IMAGE_UPLOAD_PATH;
    private static final String IMAGE_URL_PREFIX = "/product/";

    private final ItemRepository itemRepository;
    private final ColorRepostitory colorRepository;
    private final SizeRepository sizeRepository;
    private final ItemImageRepository itemImageRepository;

    private void saveColors(List<String> colorList, Item item) {
        colorRepository.deleteByItem(item);
        if (colorList == null) return;
        for (String colorName : colorList) {
            if (ColorEnum.valueOf(colorName) != null) {
                Color color = Color.builder()
                        .color(ColorEnum.valueOf(colorName))
                        .item(item)
                        .build();
                colorRepository.save(color);
            }
        }
    }

    private void saveSizes(List<String> sizeList, Item item) {
        sizeRepository.deleteByItem(item);
        if (sizeList == null) return;
        for (String sizeName : sizeList) {
            if (SizeEnum.valueOf(sizeName) != null) {
                Size size = Size.builder()
                        .size(SizeEnum.valueOf(sizeName))
                        .item(item)
                        .build();
                sizeRepository.save(size);
            }
        }
    }

    private void saveImages(List<String> imageList, Item item) {
        itemImageRepository.deleteByItem(item);
        if (imageList == null) return;
        for (String imageUrl : imageList) {
            ItemImage itemImage = ItemImage.builder()
                    .imageUrl(imageUrl)
                    .item(item)
                    .build();
            itemImageRepository.save(itemImage);
        }
    }

    /**
     * 이미지 파일을 /home/pr/www/product/에 저장하고 URL 경로를 반환
     */
    private String saveImageFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 디렉토리가 없으면 생성
        Path uploadPath = Paths.get(IMAGE_UPLOAD_PATH);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 고유한 파일명 생성 (UUID + 원본 확장자)
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFilename = UUID.randomUUID().toString() + extension;

        // 파일 저장
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath);

        log.info("Image saved: {}", filePath.toString());

        // DB에 저장할 URL 경로 반환
        return IMAGE_URL_PREFIX + newFilename;
    }

    /**
     * 여러 이미지 파일을 저장하고 URL 목록을 반환
     */
    private List<String> saveImageFiles(List<MultipartFile> files) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        if (files == null || files.isEmpty()) {
            return imageUrls;
        }

        for (MultipartFile file : files) {
            String imageUrl = saveImageFile(file);
            if (imageUrl != null) {
                imageUrls.add(imageUrl);
            }
        }
        return imageUrls;
    }


    /**
     * SKU 자동 생성: 카테고리 기반 + 타임스탬프
     * 예: MEN-TOP-T_SHIRT-1702345678901
     */
    private String generateSku(String majorCategory, String middleCategory, String subcategory) {
        String major = majorCategory != null ? majorCategory : "NONE";
        String middle = middleCategory != null ? middleCategory : "NONE";
        String sub = subcategory != null ? subcategory : "NONE";
        return String.format("%s-%s-%s-%d", major, middle, sub, System.currentTimeMillis());
    }

    public void saveItem(ItemResistraionRequest dto, MultipartFile mainImage, List<MultipartFile> images) throws IOException {
        String title = dto.getTitle();
        int price = dto.getPrice();
        int discountPercent = dto.getDiscountPercent();
        String brand = dto.getBrand();
        String description = dto.getDescription();
        List<String> colorList = dto.getColorList();
        List<String> sizeList = dto.getSizeList();
        Integer stock = dto.getStock() != null ? dto.getStock() : 0;

        // SKU: 입력값이 없으면 카테고리 기반 자동 생성
        String sku = dto.getSku();
        if (sku == null || sku.isBlank()) {
            sku = generateSku(dto.getMajorCategory(), dto.getMiddleCategory(), dto.getSubcategory());
        }

        // 카테고리 파싱
        MajorCategoryEnum majorCategory = dto.getMajorCategory() != null
            ? MajorCategoryEnum.valueOf(dto.getMajorCategory()) : null;
        MiddleCategoryEnum middleCategory = dto.getMiddleCategory() != null
            ? MiddleCategoryEnum.valueOf(dto.getMiddleCategory()) : null;
        SubcategoryEnum subcategory = dto.getSubcategory() != null
            ? SubcategoryEnum.valueOf(dto.getSubcategory()) : null;

        // 메인 이미지 저장
        String mainImageUrl = saveImageFile(mainImage);
        if (mainImageUrl == null) {
            mainImageUrl = dto.getMainImageUrl(); // 파일이 없으면 URL 사용
        }

        // 추가 이미지 저장
        List<String> imageList = saveImageFiles(images);
        if (imageList.isEmpty() && dto.getImageList() != null) {
            imageList = dto.getImageList(); // 파일이 없으면 URL 목록 사용
        }

        Item item = Item.builder()
                .title(title)
                .price(price)
                .discountPercent(discountPercent)
                .sku(sku)
                .brand(brand)
                .description(description)
                .mainImageUrl(mainImageUrl)
                .stock(stock)
                .majorCategory(majorCategory)
                .middleCategory(middleCategory)
                .subcategory(subcategory)
                .build();

        itemRepository.save(item);
        saveColors(colorList, item);
        saveSizes(sizeList, item);
        saveImages(imageList, item);
    }

    public void updateItem(Long itemId, ItemResistraionRequest dto, MultipartFile mainImage, List<MultipartFile> images) throws IOException {
        List<String> colorList = dto.getColorList() != null
            ? dto.getColorList().stream().map(color -> ColorEnum.valueOf(color).name()).toList()
            : null;
        List<String> sizeList = dto.getSizeList() != null
            ? dto.getSizeList().stream().map(size -> SizeEnum.valueOf(size).name()).toList()
            : null;

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // 메인 이미지 저장
        String mainImageUrl = saveImageFile(mainImage);
        if (mainImageUrl != null) {
            item.setMainImageUrl(mainImageUrl);
        } else if (dto.getMainImageUrl() != null) {
            item.setMainImageUrl(dto.getMainImageUrl());
        }

        // 추가 이미지 저장
        List<String> imageList = saveImageFiles(images);
        if (imageList.isEmpty() && dto.getImageList() != null) {
            imageList = dto.getImageList();
        }

        item.update(dto);
        saveColors(colorList, item);
        saveSizes(sizeList, item);
        saveImages(imageList, item);
        itemRepository.save(item);
    }

    public void deleteItem(Long itemId) {
        // itemId가 실제 DB에 존재하지 않을 경우 예외 발생
        // 삭제 전 연관된 Color, Size, Image 등도 함께 삭제해야 데이터 무결성 보장 가능
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        itemRepository.delete(item);
    }
}
