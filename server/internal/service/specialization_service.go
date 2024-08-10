package service

import "server/internal/models"

type SpecializationRepositoryInterface interface {
	GetSpecializationsWithFreeTickets() ([]models.SpecializationWithFreeTickets, error)
	GetSpecializations() ([]models.Specialization, error)
}

type SpecializationService struct {
	repo SpecializationRepositoryInterface
}

func NewSpecializationService(repo SpecializationRepositoryInterface) *SpecializationService {
	return &SpecializationService{repo: repo}
}

func (service SpecializationService) GetSpecializationsWithFreeTickets() ([]models.SpecializationWithFreeTickets, error) {
	
	specializations, err := service.repo.GetSpecializationsWithFreeTickets()
	if err != nil {
		return nil, err
	}

	return specializations, nil
}

func (service SpecializationService) GetSpecializations() ([]models.Specialization, error) {
	
	specializations, err := service.repo.GetSpecializations()
	if err != nil {
		return nil, err
	}

	return specializations, nil
}