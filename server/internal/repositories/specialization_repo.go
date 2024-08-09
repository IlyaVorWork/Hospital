package repositories

import (
	"database/sql"
	"server/internal/models"
)

var (
	GET_SPECIALIZATIONS = "SELECT * FROM specializations_view"
)

type SpecializationRepository struct {
	db *sql.DB
}

func NewSpecializationRepository(db *sql.DB) *SpecializationRepository {
	return &SpecializationRepository{db: db}
}

func (repo SpecializationRepository) GetSpecializations() ([]models.Specialization, error) {
	var specializations []models.Specialization

	rows, err := repo.db.Query(GET_SPECIALIZATIONS)
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