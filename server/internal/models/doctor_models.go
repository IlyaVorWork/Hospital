package models

type Doctor struct {
	Id           int        `json:"id"`
	Last_name 		 string 	`json:"last_name"`
	First_name 		 string 	`json:"first_name"`
	Second_name 		 string 	`json:"second_name"`
	Specialization_id int `json:"specialization_id"`
	Img_url string `json:"img_url"`
	Ticket_count int `json:"ticket_count"`
}

type AddDoctorDTO struct {
	Last_name 		 string 	`json:"last_name" binding:"required"`
	First_name 		 string 	`json:"first_name" binding:"required"`
	Second_name 		 string 	`json:"second_name" binding:"required"`
	Specialization_id int `json:"specialization_id" binding:"required"`
	Img_url string `json:"img_url" binding:"required"`
}

type EditDoctorDTO struct {
	Id           int        `json:"id" binding:"required"`
	Last_name 		 string 	`json:"last_name" binding:"required"`
	First_name 		 string 	`json:"first_name" binding:"required"`
	Second_name 		 string 	`json:"second_name" binding:"required"`
	Img_url string `json:"img_url" binding:"required"`
}

type DeleteDoctorDTO struct {
	Id           int        `json:"id" binding:"required"`
}