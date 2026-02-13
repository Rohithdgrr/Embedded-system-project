package com.examshield.repository;

import com.examshield.model.StudentScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentScoreRepository extends JpaRepository<StudentScore, Long> {
    
    List<StudentScore> findBySessionId(Long sessionId);
    
    Optional<StudentScore> findBySessionIdAndTrackingId(Long sessionId, String trackingId);
    
    List<StudentScore> findBySessionIdOrderByTotalScoreDesc(Long sessionId);
    
    @Query("SELECT s FROM StudentScore s WHERE s.session.id = :sessionId AND s.alertLevel IN ('SUSPICIOUS', 'CRITICAL')")
    List<StudentScore> findBySessionIdWithAlerts(Long sessionId);
    
    @Query("SELECT COUNT(s) FROM StudentScore s WHERE s.session.id = :sessionId AND s.alertLevel = :alertLevel")
    Long countBySessionIdAndAlertLevel(Long sessionId, StudentScore.AlertLevel alertLevel);
    
    @Query("SELECT MAX(s.totalScore) FROM StudentScore s WHERE s.session.id = :sessionId")
    Double findMaxScoreBySessionId(Long sessionId);
    
    @Query("SELECT AVG(s.totalScore) FROM StudentScore s WHERE s.session.id = :sessionId")
    Double findAvgScoreBySessionId(Long sessionId);
}
