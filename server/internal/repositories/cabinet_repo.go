package repositories

import (
	"database/sql"
	"server/internal/models"
)

var (
	GET_CABINETS = "SELECT * FROM cabinet ORDER BY number"
	ADD_CABINET = "INSERT INTO public.cabinet(number, id_specialization) VALUES ($1, $2)"
	UPDATE_CABINET = "UPDATE public.cabinet SET id_specialization=$1 WHERE number=$2"
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
		err = rows.Scan(&cabinet.Number, &cabinet.Id_specialization)
		if err != nil {
			return nil, err
		}
		cabinets = append(cabinets, cabinet)
	}

	return cabinets, nil
}

func (repo CabinetRepository) AddCabinet(cabinet models.Cabinet) error {
	_, err := repo.db.Exec(ADD_CABINET, cabinet.Number, cabinet.Id_specialization)
	if err != nil {
		return err
	}

	return nil
}

func (repo CabinetRepository) EditCabinet(cabinet models.Cabinet) error {
	_, err := repo.db.Exec(UPDATE_CABINET, cabinet.Id_specialization, cabinet.Number)
	if err != nil {
		return err
	}

	return nil
}

func (repo CabinetRepository) DeleteCabinet(cabinet models.DeleteCabinetDTO) error {
	_, err := repo.db.Exec(DELETE_CABINET, cabinet.Number)
	if err != nil {
		return err
	}

	return nil
}