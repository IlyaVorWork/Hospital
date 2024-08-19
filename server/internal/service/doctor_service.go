package service

import "server/internal/models"

type DoctorRepositoryInterface interface {
	GetDoctorsBySpec(id_spec int) ([]models.Doctor, error)
	GetDoctors() ([]models.Doctor, error)
	AddDoctor(data models.AddDoctorDTO) error
	EditDoctor(data models.EditDoctorDTO) error
	DeleteDoctor(data models.DeleteDoctorDTO) error
}

type DoctorService struct {
	repo DoctorRepositoryInterface
}

func NewDoctorService(repo DoctorRepositoryInterface) *DoctorService {
	return &DoctorService{repo: repo}
}

func (service DoctorService) GetDoctorsBySpec(id_spec int) ([]models.Doctor, error) {
	
	doctors, err := service.repo.GetDoctorsBySpec(id_spec)
	if err != nil {
		return nil, err
	}

	return doctors, nil
}

func (service DoctorService) GetDoctors() ([]models.Doctor, error) {
	doctors, err := service.repo.GetDoctors()
	if err != nil {
		return nil, err
	}

	return doctors, nil
}

func (service DoctorService) AddDoctor(data models.AddDoctorDTO) error {
	err := service.repo.AddDoctor(data)	
	if err != nil {
		return err
	}

	return nil
}

func (service DoctorService) EditDoctor(data models.EditDoctorDTO) error {
	err := service.repo.EditDoctor(data)	
	if err != nil {
		return err
	}

	return nil
}

func (service DoctorService) DeleteDoctor(data models.DeleteDoctorDTO) error {
	err := service.repo.DeleteDoctor(data)	
	if err != nil {
		return err
	}

	return nil
}