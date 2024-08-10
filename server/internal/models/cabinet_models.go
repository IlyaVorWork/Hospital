package models

type Cabinet struct {
	Number int `json:"number"`
	Id_specialization int `json:"id_specialization"`
}

type DeleteCabinetDTO struct {
	Number int `json:"number"`
}