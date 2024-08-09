package service

import "server/internal/models"

type DoctorRepositoryInterface interface {
	GetDoctorsBySpec(id_spec int) ([]models.Doctor, error)
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

	return doctors, err
}