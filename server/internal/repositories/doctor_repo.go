package repositories

import (
	"database/sql"
	"fmt"
	"server/internal/models"
)

var (
	GET_DOCTORS_WITH_FREE_TICKETS_BY_SPEC = "SELECT * FROM doctors_view WHERE id_specialization = $1"
	GET_DOCTORS = "SELECT * FROM doctor"
	ADD_DOCTOR = "INSERT INTO public.doctor(last_name, first_name, second_name, id_specialization, img_url) VALUES ($1, $2, $3, $4, $5)"
	EDIT_DOCTOR = "UPDATE public.doctor SET last_name=$1, first_name=$2, second_name=$3, img_url=$4 WHERE id=$5"
	DELETE_DOCTOR = "DELETE FROM public.doctor WHERE id=$1"
)

type DoctorRepository struct {
	db *sql.DB
}

func NewDoctorRepository(db *sql.DB) *DoctorRepository {
	return &DoctorRepository{db: db}
}

func (repo DoctorRepository) GetDoctorsBySpec(id_spec int) ([]models.DoctorWithFreeTickets, error) {
	var doctors []models.DoctorWithFreeTickets

	rows, err := repo.db.Query(GET_DOCTORS_WITH_FREE_TICKETS_BY_SPEC, id_spec)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var doctor models.DoctorWithFreeTickets
		err = rows.Scan(&doctor.Id, &doctor.Last_name, &doctor.First_name, &doctor.Second_name, &doctor.Id_specialization, &doctor.Img_url, &doctor.Ticket_count)
		if err != nil {
			return nil, err
		} 
		doctors = append(doctors, doctor)
	}

	return doctors, nil
}

func (repo DoctorRepository) GetDoctors() ([]models.Doctor, error) {
	var doctors []models.Doctor

	rows, err := repo.db.Query(GET_DOCTORS)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var doctor models.Doctor
		err = rows.Scan(&doctor.Id, &doctor.Last_name, &doctor.First_name, &doctor.Second_name, &doctor.Id_specialization, &doctor.Img_url)
		if err != nil {
			return nil, err
		} 
		doctors = append(doctors, doctor)
	}

	return doctors, nil
}

func (repo DoctorRepository) AddDoctor(data models.AddDoctorDTO) error {
	fmt.Println(data)
	_, err := repo.db.Exec(ADD_DOCTOR, data.Last_name, data.First_name, data.Second_name, data.Id_specialization, data.Img_url)
	if err != nil {
		return err
	}

	return nil
}

func (repo DoctorRepository) EditDoctor(data models.EditDoctorDTO) error {
	_, err := repo.db.Exec(EDIT_DOCTOR, data.Last_name, data.First_name, data.Second_name, data.Img_url, data.Id)
	if err != nil {
		return err
	}

	return nil
}

func (repo DoctorRepository) DeleteDoctor(data models.DeleteDoctorDTO) error {
	_, err := repo.db.Exec(DELETE_DOCTOR, data.Id)
	if err != nil {
		return err
	}

	return nil
}