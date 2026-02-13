package com.examshield.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "exam_session_seq")
    @SequenceGenerator(name = "exam_session_seq", sequenceName = "exam_session_seq", allocationSize = 1)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "expected_count")
    private Integer expectedCount;
    
    @Column(name = "actual_count")
    private Integer actualCount;
    
    @Column(name = "start_time")
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;
    
    @Column(name = "stream_url")
    private String streamUrl;
    
    @Column(name = "total_violations")
    private Integer totalViolations;
    
    @Column(name = "total_score")
    private Double totalScore;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = SessionStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum SessionStatus {
        PENDING,
        ACTIVE,
        PAUSED,
        COMPLETED,
        CANCELLED
    }
}
