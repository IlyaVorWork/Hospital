package service

import "server/internal/models"

type CabinetRepositoryInterface interface {
	GetCabinets() ([]models.Cabinet, error)
	AddCabinet(cabinet models.Cabinet) error
	EditCabinet(cabinet models.Cabinet) error
	DeleteCabinet(cabinet models.DeleteCabinetDTO) error
}

type CabinetService struct {
	repo CabinetRepositoryInterface
}

func NewCabinetService(repo CabinetRepositoryInterface) *CabinetService {
	return &CabinetService{repo: repo}
}

func (service CabinetService) GetCabinets() ([]models.Cabinet, error) {
	cabinets, err := service.repo.GetCabinets()
	if err != nil {
		return nil, err
	}

	return cabinets, nil
}

func (service CabinetService) AddCabinet(cabinet models.Cabinet) error {
	err := service.repo.AddCabinet(cabinet)
	if err != nil {
		return err
	}

	return nil
}

func (service CabinetService) EditCabinet(cabinet models.Cabinet) error {
	err := service.repo.EditCabinet(cabinet)
	if err != nil {
		return err
	}

	return nil
}

func (service CabinetService) DeleteCabinet(cabinet models.DeleteCabinetDTO) error {
	err := service.repo.DeleteCabinet(cabinet)
	if err != nil {
		return err
	}

	return nil
}
