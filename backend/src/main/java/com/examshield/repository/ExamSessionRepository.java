package com.examshield.repository;

import com.examshield.model.ExamSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExamSessionRepository extends JpaRepository<ExamSession, Long> {
    
    List<ExamSession> findByStatus(ExamSession.SessionStatus status);
    
    List<ExamSession> findByOrderByCreatedAtDesc();
    
    @Query("SELECT e FROM ExamSession e WHERE e.startTime >= :startDate AND e.endTime <= :endDate")
    List<ExamSession> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT COUNT(e) FROM ExamSession e WHERE e.status = :status")
    Long countByStatus(ExamSession.SessionStatus status);
}
