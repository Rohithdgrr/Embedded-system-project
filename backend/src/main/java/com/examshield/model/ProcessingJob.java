package com.examshield.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "processing_jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessingJob {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "processing_job_seq")
    @SequenceGenerator(name = "processing_job_seq", sequenceName = "processing_job_seq", allocationSize = 1)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String jobId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private ExamSession session;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobType jobType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;
    
    @Column(name = "file_name")
    private String fileName;
    
    @Column(name = "file_path")
    private String filePath;
    
    @Column(name = "stream_url")
    private String streamUrl;
    
    @Column(name = "total_frames")
    private Long totalFrames;
    
    @Column(name = "processed_frames")
    private Long processedFrames;
    
    @Column(name = "progress_percentage")
    private Integer progressPercentage;
    
    @Column(name = "detection_count")
    private Integer detectionCount;
    
    @Column(name = "error_message")
    private String errorMessage;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = JobStatus.PENDING;
        if (progressPercentage == null) progressPercentage = 0;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum JobType {
        VIDEO_UPLOAD,
        LIVE_STREAM
    }
    
    public enum JobStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED,
        CANCELLED
    }
}
