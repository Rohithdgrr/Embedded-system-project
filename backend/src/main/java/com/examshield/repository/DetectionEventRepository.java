package com.examshield.repository;

import com.examshield.model.DetectionEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DetectionEventRepository extends JpaRepository<DetectionEvent, Long> {
    
    List<DetectionEvent> findBySessionId(Long sessionId);
    
    List<DetectionEvent> findBySessionIdOrderByTimestampDesc(Long sessionId);
    
    List<DetectionEvent> findBySessionIdAndPersonId(Long sessionId, String personId);
    
    @Query("SELECT d FROM DetectionEvent d WHERE d.session.id = :sessionId AND d.timestamp >= :since")
    List<DetectionEvent> findBySessionIdAndTimestampAfter(Long sessionId, LocalDateTime since);
    
    @Query("SELECT COUNT(d) FROM DetectionEvent d WHERE d.session.id = :sessionId AND d.eventType = :eventType")
    Long countBySessionIdAndEventType(Long sessionId, DetectionEvent.EventType eventType);
    
    @Query("SELECT d.eventType, COUNT(d) FROM DetectionEvent d WHERE d.session.id = :sessionId GROUP BY d.eventType")
    List<Object[]> countBySessionIdGroupByEventType(Long sessionId);
    
    @Query("SELECT DISTINCT d.personId FROM DetectionEvent d WHERE d.session.id = :sessionId")
    List<String> findDistinctPersonIdsBySessionId(Long sessionId);
}
