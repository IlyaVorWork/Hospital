package service

import (
	"os"
	"server/internal/models"
	"server/pkg/custom_errors"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

type AuthRepositoryInterface interface {
	GetPatientData(id int) (models.Patient, error)
	IsUserExists(role, login string) error
	LoginUser(data models.LoginDTO) (models.User, error)
	RegisterPatient(data models.RegisterDTO, password []byte) error
	ChangePassword(patient_id int, pass_hash []byte) error
	GetPatients() ([]models.Patient, error)
}

type AuthService struct {
	repo AuthRepositoryInterface
}

func NewAuthService(repo AuthRepositoryInterface) *AuthService {
	return &AuthService{repo: repo}
}

func (service AuthService) LoginUser(data models.LoginDTO) (string, error) {
	err := service.repo.IsUserExists(data.Role, data.Login)
	if err != nil {
		return "", err
	}

	user, err := service.repo.LoginUser(data)
	if err != nil {
		return "", err
	}

	payload := jwt.MapClaims{
		"exp":   time.Now().Add(time.Minute * 60).Unix(),
		"id": 	 user.Id,
		"login": user.Login,
		"role": data.Role,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)

	JWT_SECRET_KEY, _ := os.LookupEnv("JWT_SECRET_KEY")

	t, err := token.SignedString([]byte(JWT_SECRET_KEY))
	if err != nil {
		return "", err
	}

	return t, err
}

func (service AuthService) RegisterPatient(data models.RegisterDTO) error {
	err := service.repo.IsUserExists("patient", data.Login)
	if err == nil {
		return custom_errors.ErrExistingLogin
	}

	pass_hash, err := bcrypt.GenerateFromPassword([]byte(data.Password), 14)
	if err != nil {
		return err
	}

	err = service.repo.RegisterPatient(data, pass_hash)
	if err != nil {
		return err
	}

	return nil
}

func (service AuthService) GetPatientData(id int) (models.Patient, error) {
	
	userData, err := service.repo.GetPatientData(id)
	if err != nil {
		return models.Patient{}, err
	}

	return userData, nil
}

func (service AuthService) ChangePassword(data models.ChangePasswordDTO) error {
	
	pass_hash, err := bcrypt.GenerateFromPassword([]byte(data.Password), 14)
	if err != nil {
		return err
	}

	err = service.repo.ChangePassword(data.Patient_Id, pass_hash)
	if err != nil {
		return err
	}

	return nil
}

func (service AuthService) GetPatients() ([]models.Patient, error) {
	patients, err := service.repo.GetPatients()
	if err != nil {
		return nil, err
	}

	return patients, nil
}

