package com.examshield.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "detection_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetectionEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "detection_event_seq")
    @SequenceGenerator(name = "detection_event_seq", sequenceName = "detection_event_seq", allocationSize = 1)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private ExamSession session;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    @Column(name = "person_id")
    private String personId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "confidence")
    private Double confidence;
    
    @Column(name = "points")
    private Integer points;
    
    @Column(name = "bounding_box_x")
    private Integer boundingBoxX;
    
    @Column(name = "bounding_box_y")
    private Integer boundingBoxY;
    
    @Column(name = "bounding_box_width")
    private Integer boundingBoxWidth;
    
    @Column(name = "bounding_box_height")
    private Integer boundingBoxHeight;
    
    @Column(name = "screenshot_path")
    private String screenshotPath;
    
    @Column(name = "is_resolved")
    private Boolean isResolved;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (isResolved == null) {
            isResolved = false;
        }
    }
    
    public enum EventType {
        PHONE_DETECTED,
        EARPHONE_DETECTED,
        SMARTWATCH_DETECTED,
        CHIT_DETECTED,
        TEXTBOOK_DETECTED,
        NOTEBOOK_DETECTED,
        ELECTRONIC_DEVICE_DETECTED,
        HEAD_TURNED,
        LOOKING_AT_NEIGHBOR,
        LEANING_TOWARD_OTHER,
        PASSING_GESTURE,
        HEAD_COUNT_MISMATCH,
        EXTRA_PERSON,
        INTERACTION_DETECTED
    }
}
