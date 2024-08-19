package models

import "time"

type Time struct {
	Id int `json:"id"`
	Time string `json:"time"`
}

type MakeScheduleDTO struct {
	Specialization_id int `json:"specialization_id" binding:"required"`
	Date time.Time `json:"date" binding:"required"`
	Doctor_id int `json:"doctor_id" binding:"required"`
	Time_ids []int `json:"time_ids" binding:"required"`
}

type GetScheduleDTO struct {
	Date time.Time `json:"date" binding:"required"`
	Doctor_id int `json:"doctor_id" binding:"required"`
}

type GetFreeTimesDTO struct {
	Date time.Time `json:"date" binding:"required"`
	Doctor_id int `json:"doctor_id" binding:"required"`
	Specialization_id int `json:"specialization_id" binding:"required"`
}

type DeleteScheduleDTO struct {
	Date time.Time `json:"date" binding:"required"`
	Doctor_id int `json:"doctor_id" binding:"required"`
	Time_ids []int `json:"time_ids" binding:"required"`
}