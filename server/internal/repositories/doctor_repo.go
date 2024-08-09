package repositories

import (
	"database/sql"
	"server/internal/models"
)

var (
	GET_DOCTORS_BY_SPEC = "SELECT * FROM doctors_view WHERE id_specialization = $1"
)

type DoctorRepository struct {
	db *sql.DB
}

func NewDoctorRepository(db *sql.DB) *DoctorRepository {
	return &DoctorRepository{db: db}
}

func (repo DoctorRepository) GetDoctorsBySpec(id_spec int) ([]models.Doctor, error) {
	var doctors []models.Doctor

	rows, err := repo.db.Query(GET_DOCTORS_BY_SPEC, id_spec)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var doctor models.Doctor
		err = rows.Scan(&doctor.Id, &doctor.Last_name, &doctor.First_name, &doctor.Second_name, &doctor.Id_specialization, &doctor.Img_url, &doctor.Ticket_count)
		if err != nil {
			return nil, err
		} 
		doctors = append(doctors, doctor)
	}

	return doctors, nil
}