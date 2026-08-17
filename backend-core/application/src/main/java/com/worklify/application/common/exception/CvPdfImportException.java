package com.worklify.application.common.exception;

public class CvPdfImportException extends RuntimeException {
    public CvPdfImportException(String message) { super(message); }
    public CvPdfImportException(String message, Throwable cause) { super(message, cause); }
}