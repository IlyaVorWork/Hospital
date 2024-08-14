package service

import (
	"server/internal/models"
	"time"
)

type ScheduleRepositoryInterface interface {
	GetFreeTickets(id_doctor int) ([]models.Ticket, error)
	MakeAppointment(AppointData models.MakeAppointDTO) error
	GetAppointmentsByPatientId(patient_id int) ([]models.Appointment, error)
	CancelAppointment(CancelAppointData models.CancelAppointDTO) error
	GetFreeTimes(ScheduleData models.GetFreeTimesDTO) ([]models.Time, error)
	GetFreeCabinets(spec_id, time_id int, date time.Time) ([]models.Cabinet, error)
	MakeSchedule(time_id, cabinet_number, doctor_id  int, date time.Time) error
	GetSchedule(ScheduleData models.GetScheduleDTO) ([]models.Time, error)
	DeleteSchedule(time_id, doctor_id int, date time.Time) error
}

type ScheduleService struct {
	repo ScheduleRepositoryInterface
}

func NewScheduleService(repo ScheduleRepositoryInterface) *ScheduleService {
	return &ScheduleService{repo: repo}
}

func (service ScheduleService) GetFreeTickets(id_doctor int) ([]models.Ticket, error) {
	
	doctors, err := service.repo.GetFreeTickets(id_doctor)
	if err != nil {
		return nil, err
	}

	return doctors, err
}

func (service ScheduleService) MakeAppointment(AppointData models.MakeAppointDTO) error {
	
	err := service.repo.MakeAppointment(AppointData)
	if err != nil {
		return err
	}

	return nil
}

func (service ScheduleService) GetAppointmentsByPatientId(patient_id int) ([]models.Appointment, error) {
	appointments, err := service.repo.GetAppointmentsByPatientId(patient_id)
	if err != nil {
		return nil, err
	}

	return appointments, nil
}

func (service ScheduleService) CancelAppointment(CancelAppointData models.CancelAppointDTO) error {
	err := service.repo.CancelAppointment(CancelAppointData)
	if err != nil {
		return err
	}

	return nil
}

func (service ScheduleService) GetFreeTimes(ScheduleData models.GetFreeTimesDTO) ([]models.Time, error) {
	times, err := service.repo.GetFreeTimes(ScheduleData)
	if err != nil {
		return nil, err
	}

	return times, nil
}

func (service ScheduleService) MakeSchedule(ScheduleData models.MakeScheduleDTO) error {
	
	for _, time := range ScheduleData.Time_ids {
		cabinets, err := service.repo.GetFreeCabinets(ScheduleData.Specialization_id, time, ScheduleData.Date)
		if err != nil {
			return err
		}

		err = service.repo.MakeSchedule(time, cabinets[0].Number, ScheduleData.Doctor_id, ScheduleData.Date)
		if err != nil {
			return err
		}
	}

	return nil
}

func (service ScheduleService) GetSchedule(ScheduleData models.GetScheduleDTO) ([]models.Time, error) {
	
	times, err := service.repo.GetSchedule(ScheduleData)
	if err != nil {
		return nil, err
	}

	return times, nil
}

func (service ScheduleService) DeleteSchedule(ScheduleData models.DeleteScheduleDTO) error {
	for _, time := range ScheduleData.Time_ids {
		err := service.repo.DeleteSchedule(time, ScheduleData.Doctor_id, ScheduleData.Date)
		if err != nil {
			return err
		}
	}

	return nil
}

