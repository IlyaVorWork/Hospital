package models

type DoctorWithFreeTickets struct {
	Id           int        `json:"id"`
	Last_name 		 string 	`json:"last_name"`
	First_name 		 string 	`json:"first_name"`
	Second_name 		 string 	`json:"second_name"`
	Id_specialization int `json:"id_specialization"`
	Img_url string `json:"img_url"`
	Ticket_count int `json:"ticket_count"`
}

type Doctor struct {
	Id           int        `json:"id"`
	Last_name 		 string 	`json:"last_name"`
	First_name 		 string 	`json:"first_name"`
	Second_name 		 string 	`json:"second_name"`
	Id_specialization int `json:"id_specialization"`
	Img_url string `json:"img_url"`
}

type AddDoctorDTO struct {
	Last_name 		 string 	`json:"last_name"`
	First_name 		 string 	`json:"first_name"`
	Second_name 		 string 	`json:"second_name"`
	Id_specialization int `json:"id_specialization"`
	Img_url string `json:"img_url"`
}

type EditDoctorDTO struct {
	Id           int        `json:"id"`
	Last_name 		 string 	`json:"last_name"`
	First_name 		 string 	`json:"first_name"`
	Second_name 		 string 	`json:"second_name"`
	Img_url string `json:"img_url"`
}

type DeleteDoctorDTO struct {
	Id           int        `json:"id"`
}