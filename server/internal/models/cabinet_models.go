package models

type Cabinet struct {
	Number int `json:"number" binding:"required"`
	Specialization_id int `json:"specialization_id" binding:"required"`
}

type DeleteCabinetDTO struct {
	Number int `json:"number" binding:"required"`
}