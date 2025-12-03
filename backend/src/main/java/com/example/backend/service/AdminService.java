package com.example.backend.service;

import java.util.List;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.backend.dto.admin.ItemResistraionRequest;
import com.example.backend.dto.item.PlanCreateRequest;
import com.example.backend.dto.item.PlanResponse;
import com.example.backend.dto.item.whop.CreateProductRequest;
import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.details.Color;
import com.example.backend.entity.item.details.ItemImage;
import com.example.backend.entity.item.details.Size;
import com.example.backend.entity.item.enums.ColorEnum;
import com.example.backend.entity.item.enums.SizeEnum;
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

    private final ItemRepository itemRepository;
    private final ColorRepostitory colorRepository;
    private final SizeRepository sizeRepository;
    private final ItemImageRepository itemImageRepository;
    private final WebClient webClient;

    private void saveColors(List<String> colorList, Item item) {
        colorRepository.deleteByItem(item);
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
        for (String imageUrl : imageList) {
            ItemImage itemImage = ItemImage.builder()
                    .imageUrl(imageUrl)
                    .item(item)
                    .build();
            itemImageRepository.save(itemImage);
        }
    }

    private CreateProductResponse createProduct(CreateProductRequest dto) {
        return webClient.post()
                .uri("products")
                .bodyValue(dto)
                .retrieve()
                .bodyToMono(CreateProductRequest.class)
                .block();
    }


    public void saveItem(ItemResistraionRequest dto) {
        // dto의 필드 값이 null일 경우 예외 발생 가능
        // Item 객체 생성 시 필수값 누락 여부 확인 필요
        // itemRepository.save(item) 호출 후 반환값 활용 가능 (예: 저장된 item의 id)
        // saveColors, saveSizes, saveImages에서 각각의 리스트가 null일 경우 NPE 발생 가능
        // 트랜잭션 처리 필요 시 @Transactional 어노테이션 추가 고려
        String title = dto.getTitle();
        int price = dto.getPrice();
        int discountPercent = dto.getDiscountPercent();
        String sku = dto.getSku();
        String brand = dto.getBrand();
        String description = dto.getDescription();
        String mainImageUrl = dto.getMainImageUrl();
        List<String> colorList = dto.getColorList();
        List<String> sizeList = dto.getSizeList();
        List<String> imageList = dto.getImageList();
        
        Item item = Item.builder()
                .title(title)
                .price(price)
                .discountPercent(discountPercent)
                .sku(sku)
                .brand(brand)
                .description(description)
                .mainImageUrl(mainImageUrl)
                .build();

        itemRepository.save(item);
        saveColors(colorList, item);
        saveSizes(sizeList, item);
        saveImages(imageList, item);
    }

    public void updateItem(Long itemId, ItemResistraionRequest dto) {
        // itemId가 실제 DB에 존재하지 않을 경우 예외 발생
        // dto의 필드 값이 null일 경우 예외 발생 가능
        // item.update(dto)에서 필드 매핑이 올바르게 되는지 확인 필요
        // saveColors, saveSizes, saveImages에서 각각의 리스트가 null일 경우 NPE 발생 가능
        // 트랜잭션 처리 필요 시 @Transactional 어노테이션 추가 고려
        String title = dto.getTitle();
        int price = dto.getPrice();
        int discountPercent = dto.getDiscountPercent();
        String sku = dto.getSku();
        String brand = dto.getBrand();
        String description = dto.getDescription();
        String mainImageUrl = dto.getMainImageUrl();
        List<String> colorList = dto.getColorList().stream().map(color -> ColorEnum.valueOf(color).name()).toList();
        List<String> sizeList = dto.getSizeList().stream().map(size -> SizeEnum.valueOf(size).name()).toList();
        List<String> imageList = dto.getImageList();


        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

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
