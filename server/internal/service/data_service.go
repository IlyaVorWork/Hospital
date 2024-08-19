package service

import "server/internal/models"

type DataRepositoryInterface interface {
	GetSpecializationsWithFreeTickets() ([]models.Specialization, error)
	GetGenders() ([]models.Gender, error)
}

type DataService struct {
	repo DataRepositoryInterface
}

func NewDataService(repo DataRepositoryInterface) *DataService {
	return &DataService{repo: repo}
}

func (service DataService) GetSpecializationsWithFreeTickets() ([]models.Specialization, error) {
	specializations, err := service.repo.GetSpecializationsWithFreeTickets()
	if err != nil {
		return nil, err
	}

	return specializations, nil
}

func (service DataService) GetGenders() ([]models.Gender, error) {
	genders, err := service.repo.GetGenders()
	if err != nil {
		return nil, err
	}

	return genders, nil
}