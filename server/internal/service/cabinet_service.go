package service

import (
	"server/internal/models"
	"server/pkg/custom_errors"
)

type CabinetRepositoryInterface interface {
	GetCabinets() ([]models.Cabinet, error)
	IsCabinetExists(cabinet_number int) error
	AddCabinet(cabinet models.Cabinet) error
	EditCabinet(cabinet models.Cabinet) error
	DeleteCabinet(data models.DeleteCabinetDTO) error
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

	err := service.repo.IsCabinetExists(cabinet.Number)
	if err == nil {
		return custom_errors.ErrExistingCabinet
	} 

	err = service.repo.AddCabinet(cabinet)
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

func (service CabinetService) DeleteCabinet(data models.DeleteCabinetDTO) error {
	err := service.repo.DeleteCabinet(data)
	if err != nil {
		return err
	}

	return nil
}
