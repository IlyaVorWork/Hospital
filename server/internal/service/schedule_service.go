package service

import (
	"server/internal/models"
	"time"
)

type ScheduleRepositoryInterface interface {
	GetFreeTimes(data models.GetFreeTimesDTO) ([]models.Time, error)
	GetFreeCabinets(spec_id, time_id int, date time.Time) ([]models.Cabinet, error)
	MakeSchedule(time_id, cabinet_number, doctor_id  int, date time.Time) error
	GetSchedule(data models.GetScheduleDTO) ([]models.Time, error)
	DeleteSchedule(time_id, doctor_id int, date time.Time) error
}

type ScheduleService struct {
	repo ScheduleRepositoryInterface
}

func NewScheduleService(repo ScheduleRepositoryInterface) *ScheduleService {
	return &ScheduleService{repo: repo}
}

func (service ScheduleService) GetFreeTimes(data models.GetFreeTimesDTO) ([]models.Time, error) {
	times, err := service.repo.GetFreeTimes(data)
	if err != nil {
		return nil, err
	}

	return times, nil
}

func (service ScheduleService) MakeSchedule(data models.MakeScheduleDTO) error {
	
	for _, time := range data.Time_ids {
		cabinets, err := service.repo.GetFreeCabinets(data.Specialization_id, time, data.Date)
		if err != nil {
			return err
		}

		err = service.repo.MakeSchedule(time, cabinets[0].Number, data.Doctor_id, data.Date)
		if err != nil {
			return err
		}
	}

	return nil
}

func (service ScheduleService) GetSchedule(data models.GetScheduleDTO) ([]models.Time, error) {
	
	times, err := service.repo.GetSchedule(data)
	if err != nil {
		return nil, err
	}

	return times, nil
}

func (service ScheduleService) DeleteSchedule(data models.DeleteScheduleDTO) error {
	for _, time := range data.Time_ids {
		err := service.repo.DeleteSchedule(time, data.Doctor_id, data.Date)
		if err != nil {
			return err
		}
	}

	return nil
}

