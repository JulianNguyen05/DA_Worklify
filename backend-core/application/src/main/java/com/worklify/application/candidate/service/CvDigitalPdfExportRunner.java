package com.worklify.application.candidate.service;

public interface CvDigitalPdfExportRunner {
    /** Fire-and-forget — không trả kết quả, không throw ra ngoài. */
    void exportAsync(Long cvId, String rawText);
}