package com.examshield.repository;

import com.examshield.model.ProcessingJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProcessingJobRepository extends JpaRepository<ProcessingJob, Long> {
    
    Optional<ProcessingJob> findByJobId(String jobId);
    
    List<ProcessingJob> findBySessionId(Long sessionId);
    
    List<ProcessingJob> findByStatus(ProcessingJob.JobStatus status);
    
    List<ProcessingJob> findByJobType(ProcessingJob.JobType jobType);
}
