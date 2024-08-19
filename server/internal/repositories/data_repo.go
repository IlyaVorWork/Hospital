package repositories

import (
	"database/sql"
	"server/internal/models"
)

var (
	GET_SPECIALIZATIONS_WITH_FREE_TICKETS = "SELECT * FROM specializations_view"
	GET_GENDERS = "SELECT * FROM k_sex"
)

type DataRepository struct {
	db *sql.DB
}

func NewDataRepository(db *sql.DB) *DataRepository {
	return &DataRepository{db: db}
}

func (repo DataRepository) GetSpecializationsWithFreeTickets() ([]models.Specialization, error) {
	var specializations []models.Specialization

	rows, err := repo.db.Query(GET_SPECIALIZATIONS_WITH_FREE_TICKETS)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var spec models.Specialization
		err = rows.Scan(&spec.Id, &spec.Name, &spec.Ticket_count)
		if err != nil {
			return nil, err
		}
		specializations = append(specializations, spec)
	}

	return specializations, nil
}

func (repo DataRepository) GetGenders() ([]models.Gender, error) {
	var genders []models.Gender

	rows, err := repo.db.Query(GET_GENDERS)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var gender models.Gender
		err = rows.Scan(&gender.Id, &gender.Gender)
		if err != nil {
			return nil, err
		}
		genders = append(genders, gender)
	}

	return genders, nil
}