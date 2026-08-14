package com.worklify.application.candidate.port;

public interface CvPdfExportPort {
    /**
     * Render cvData (rawText JSON) thành PDF pixel-perfect y hệt live builder,
     * đồng thời nhúng kèm chính JSON đó vào PDF (embedded file) để phục vụ
     * convert ngược PDF -> CV Builder sau này.
     */
    byte[] exportDigitalPdf(String rawTextJson);
}