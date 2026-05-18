package com.smartmatch.application.candidate.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin kỹ năng")
public class SkillResponse {

    @Schema(description = "ID kỹ năng", example = "1")
    private Long id;

    @Schema(description = "Tên kỹ năng", example = "Java")
    private String name;
}