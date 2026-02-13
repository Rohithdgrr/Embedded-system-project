package com.examshield.dto;

import com.examshield.model.DetectionEvent;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetectionEventDTO {
    
    private Long id;
    private Long sessionId;
    private LocalDateTime timestamp;
    private String personId;
    private DetectionEvent.EventType eventType;
    private String description;
    private Double confidence;
    private Integer points;
    private BoundingBox boundingBox;
    private String screenshotPath;
    private Boolean isResolved;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BoundingBox {
        private Integer x;
        private Integer y;
        private Integer width;
        private Integer height;
    }
    
    public static DetectionEventDTO fromEntity(DetectionEvent event) {
        BoundingBox box = null;
        if (event.getBoundingBoxX() != null) {
            box = BoundingBox.builder()
                    .x(event.getBoundingBoxX())
                    .y(event.getBoundingBoxY())
                    .width(event.getBoundingBoxWidth())
                    .height(event.getBoundingBoxHeight())
                    .build();
        }
        
        return DetectionEventDTO.builder()
                .id(event.getId())
                .sessionId(event.getSession().getId())
                .timestamp(event.getTimestamp())
                .personId(event.getPersonId())
                .eventType(event.getEventType())
                .description(event.getDescription())
                .confidence(event.getConfidence())
                .points(event.getPoints())
                .boundingBox(box)
                .screenshotPath(event.getScreenshotPath())
                .isResolved(event.getIsResolved())
                .build();
    }
}
