package models

import "time"

type Ticket struct {
	Date time.Time `json:"date"`
	Cabinet_number int `json:"cabinet_number"`
	Time_id int `json:"time_id"`
	Time string `json:"time"`
}

type MakeAppointDTO struct {
	Date time.Time `json:"date"`
	Patient_id int `json:"patient_id"`
	Cabinet_number int `json:"cabinet_number"`
	Time_id int `json:"time_id"`
}	

type CancelAppointDTO struct {
	Date time.Time `json:"date"`
	Cabinet_number int `json:"cabinet_number"`
	Time_id int `json:"time_id"`
}

type Appointment struct {
	Date time.Time `json:"date"`
	Cabinet_number int `json:"cabinet_number"`
	Specialization string `json:"specialization"`
	Time_id int `json:"time_id"`
	Time string `json:"time"`
	Last_name string `json:"last_name"`
	First_name string `json:"first_name"`
	Second_name string `json:"second_name"`
	Img_url string `json:"img_url"`
}

type Time struct {
	Id int `json:"id"`
	Time string `json:"time"`
}

type MakeScheduleDTO struct {
	Specialization_id int `json:"specialization_id"`
	Date time.Time `json:"date"`
	Doctor_id int `json:"doctor_id"`
	Time_ids []int `json:"time_ids"`
}

type GetScheduleDTO struct {
	Date time.Time `json:"date"`
	Doctor_id int `json:"doctor_id"`
}

type GetFreeTimesDTO struct {
	Date time.Time `json:"date"`
	Doctor_id int `json:"doctor_id"`
	Specialization_id int `json:"specialization_id"`
}

type DeleteScheduleDTO struct {
	Date time.Time `json:"date"`
	Doctor_id int `json:"doctor_id"`
	Time_ids []int `json:"time_ids"`
}