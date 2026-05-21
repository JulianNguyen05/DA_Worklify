// File: application/src/main/java/com/smartmatch/application/common/dto/FileData.java
package com.smartmatch.application.common.dto;
import java.io.InputStream;

public record FileData(String fileName, InputStream content, long size, String contentType) {}