package repositories

import (
	"database/sql"
	"server/internal/models"
	"time"
)

var (
	GET_FREE_TIMES = "SELECT * FROM k_time t WHERE NOT EXISTS(SELECT 1 FROM schedule_view WHERE date = $1 AND doctor_id = $2 AND time_id = t.id) AND EXISTS(SELECT 1 FROM cabinet c WHERE c.specialization_id = $3 AND NOT EXISTS(SELECT * FROM schedule s WHERE time_id = t.id AND date = $1 AND s.cabinet_number = c.number))"
	GET_FREE_CABINETS = "SELECT c.number, c.specialization_id FROM cabinet c WHERE c.specialization_id = $1 AND NOT EXISTS(SELECT * FROM schedule s WHERE time_id = $2 AND date = $3 AND s.cabinet_number = c.number)"
	MAKE_SCHEDULE = "INSERT INTO public.schedule(date, cabinet_number, doctor_id, time_id) VALUES ($1, $2, $3, $4)"
	GET_SCHEDULE = "SELECT time_id, t.time FROM public.schedule JOIN k_time t on t.id = time_id WHERE date = $1 AND doctor_id = $2 ORDER BY time_id"
	DELETE_SCHEDULE = "DELETE FROM public.schedule WHERE date = $1 AND doctor_id = $2 AND time_id = $3"
)

type ScheduleRepository struct {
	db *sql.DB
}

func NewScheduleRepository(db *sql.DB) *ScheduleRepository {
	return &ScheduleRepository{db: db}
}

func (repo ScheduleRepository) GetFreeTimes(data models.GetFreeTimesDTO) ([]models.Time, error) {
	var times []models.Time

	rows, err := repo.db.Query(GET_FREE_TIMES, data.Date, data.Doctor_id, data.Specialization_id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var time models.Time
		err = rows.Scan(&time.Id, &time.Time)
		if err != nil {
			return nil, err
		} 
		times = append(times, time)
	}

	return times, nil
}

func (repo ScheduleRepository) GetFreeCabinets(spec_id, time_id int, date time.Time) ([]models.Cabinet, error) {
	var cabinets []models.Cabinet
	
	rows, err := repo.db.Query(GET_FREE_CABINETS, spec_id, time_id, date)
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

func (repo ScheduleRepository) MakeSchedule(time_id, cabinet_number, doctor_id int, date time.Time) error {
	_, err := repo.db.Exec(MAKE_SCHEDULE, date, cabinet_number, doctor_id, time_id)
	if err != nil {
		return err
	}

	return nil
}

func (repo ScheduleRepository) GetSchedule(data models.GetScheduleDTO) ([]models.Time, error) {
	var times []models.Time

	rows, err := repo.db.Query(GET_SCHEDULE, data.Date, data.Doctor_id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var time models.Time
		err = rows.Scan(&time.Id, &time.Time)
		if err != nil {
			return nil, err
		}
		times = append(times, time)
	}

	return times, nil
}

func (repo ScheduleRepository) DeleteSchedule(time_id, doctor_id int, date time.Time) error {
	_, err := repo.db.Exec(DELETE_SCHEDULE, date, doctor_id, time_id)
	if err != nil {
		return err
	}

	return nil
}