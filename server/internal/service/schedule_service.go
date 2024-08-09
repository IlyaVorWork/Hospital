package service

import (
	"server/internal/models"
)

type ScheduleRepositoryInterface interface {
	GetFreeTickets(id_doctor int) ([]models.Ticket, error)
	MakeAppointment(AppointData models.MakeAppointDTO) error
	GetAppointmentsByPatientId(patient_id int) ([]models.Appointment, error)
	CancelAppointment(CancelAppointData models.CancelAppointDTO) error
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