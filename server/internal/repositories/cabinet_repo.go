package repositories

import (
	"database/sql"
	"server/internal/models"
)

var (
	GET_CABINETS = "SELECT * FROM cabinet ORDER BY number"
	IS_CABINET_EXISTS = "SELECT * FROM cabinet WHERE number = $1"
	ADD_CABINET = "INSERT INTO public.cabinet(number, specialization_id) VALUES ($1, $2)"
	UPDATE_CABINET = "UPDATE public.cabinet SET specialization_id=$1 WHERE number=$2"
	DELETE_CABINET = "DELETE FROM public.cabinet WHERE number=$1"
)

type CabinetRepository struct {
	db *sql.DB
}

func NewCabinetRepository(db *sql.DB) *CabinetRepository {
	return &CabinetRepository{db: db}
}

func (repo CabinetRepository) GetCabinets() ([]models.Cabinet, error) {
	var cabinets []models.Cabinet

	rows, err := repo.db.Query(GET_CABINETS)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var cabinet models.Cabinet
		err = rows.Scan(&cabinet.Number, &cabinet.Specialization_id)
		if err != nil {
			return nil, err
		}
		cabinets = append(cabinets, cabinet)
	}

	return cabinets, nil
}

func (repo CabinetRepository) IsCabinetExists(cabinet_number int) error {
	var cabinet models.Cabinet

	err := repo.db.QueryRow(IS_CABINET_EXISTS, cabinet_number).Scan(&cabinet.Number, &cabinet.Specialization_id)
	if err != nil {
		return err
	}

	return nil
}

func (repo CabinetRepository) AddCabinet(cabinet models.Cabinet) error {
	_, err := repo.db.Exec(ADD_CABINET, cabinet.Number, cabinet.Specialization_id)
	if err != nil {
		return err
	}

	return nil
}

func (repo CabinetRepository) EditCabinet(cabinet models.Cabinet) error {
	_, err := repo.db.Exec(UPDATE_CABINET, cabinet.Specialization_id, cabinet.Number)
	if err != nil {
		return err
	}

	return nil
}

func (repo CabinetRepository) DeleteCabinet(data models.DeleteCabinetDTO) error {
	_, err := repo.db.Exec(DELETE_CABINET, data.Number)
	if err != nil {
		return err
	}

	return nil
}