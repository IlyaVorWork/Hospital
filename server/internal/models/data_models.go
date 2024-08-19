package models

type Specialization struct {
	Id           int        `json:"id"`
	Name 		 string 	`json:"name"`
	Ticket_count int 		`json:"ticket_count"`
}

type Gender struct {
	Id int `json:"id"`
	Gender string `json:"gender"`
}