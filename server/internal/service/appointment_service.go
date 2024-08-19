package service

import "server/internal/models"

type AppointmentRepositoryInterface interface {
	GetFreeAppointments(doctor_id int) ([]models.Ticket, error)
	MakeAppointment(data models.MakeAppointDTO) error
	GetAppointmentsByPatientId(patient_id int) ([]models.Appointment, error)
	CancelAppointment(data models.CancelAppointDTO) error
}

type AppointmentService struct {
	repo AppointmentRepositoryInterface
}

func NewAppointmentService(repo AppointmentRepositoryInterface) *AppointmentService {
	return &AppointmentService{repo: repo}
}

func (service AppointmentService) GetFreeAppointments(doctor_id int) ([]models.Ticket, error) {
	
	doctors, err := service.repo.GetFreeAppointments(doctor_id)
	if err != nil {
		return nil, err
	}

	return doctors, err
}

func (service AppointmentService) MakeAppointment(data models.MakeAppointDTO) error {
	
	err := service.repo.MakeAppointment(data)
	if err != nil {
		return err
	}

	return nil
}

func (service AppointmentService) GetAppointmentsByPatientId(patient_id int) ([]models.Appointment, error) {
	appointments, err := service.repo.GetAppointmentsByPatientId(patient_id)
	if err != nil {
		return nil, err
	}

	return appointments, nil
}

func (service AppointmentService) CancelAppointment(data models.CancelAppointDTO) error {
	err := service.repo.CancelAppointment(data)
	if err != nil {
		return err
	}

	return nil
}