package com.runaway.project.running.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor // 기본생성자
public class RunningDto {

    private Long runIdx;

    private Long userIdx;


    private String date;

    private String time;

    private double distance;

    private String averagePace;

    private String runningTime;

    private List<LocationDto> path; // 위도와 경도의 배열을 나타내는 필드

    private int calorie;

}