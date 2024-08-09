package service

import "server/internal/models"

type SpecializationRepositoryInterface interface {
	GetSpecializations() ([]models.Specialization, error)
}

type SpecializationService struct {
	repo SpecializationRepositoryInterface
}

func NewSpecializationService(repo SpecializationRepositoryInterface) *SpecializationService {
	return &SpecializationService{repo: repo}
}

func (service SpecializationService) GetSpecializations() ([]models.Specialization, error) {
	
	specializations, err := service.repo.GetSpecializations()
	if err != nil {
		return nil, err
	}

	return specializations, err
}