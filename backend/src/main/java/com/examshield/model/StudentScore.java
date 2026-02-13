package com.examshield.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentScore {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "student_score_seq")
    @SequenceGenerator(name = "student_score_seq", sequenceName = "student_score_seq", allocationSize = 1)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private ExamSession session;
    
    @Column(name = "tracking_id", nullable = false)
    private String trackingId;
    
    @Column(name = "total_score")
    private Double totalScore;
    
    @Column(name = "violation_count")
    private Integer violationCount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "alert_level")
    private AlertLevel alertLevel;
    
    @Column(name = "phone_count")
    private Integer phoneCount;
    
    @Column(name = "earphone_count")
    private Integer earphoneCount;
    
    @Column(name = "watch_count")
    private Integer watchCount;
    
    @Column(name = "chit_count")
    private Integer chitCount;
    
    @Column(name = "textbook_count")
    private Integer textbookCount;
    
    @Column(name = "notebook_count")
    private Integer notebookCount;
    
    @Column(name = "behavior_count")
    private Integer behaviorCount;
    
    @Column(name = "first_seen")
    private LocalDateTime firstSeen;
    
    @Column(name = "last_seen")
    private LocalDateTime lastSeen;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        firstSeen = LocalDateTime.now();
        lastSeen = LocalDateTime.now();
        if (totalScore == null) totalScore = 0.0;
        if (violationCount == null) violationCount = 0;
        if (alertLevel == null) alertLevel = AlertLevel.NORMAL;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum AlertLevel {
        NORMAL,
        WATCH,
        SUSPICIOUS,
        CRITICAL
    }
}
