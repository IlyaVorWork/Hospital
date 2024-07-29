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
	Login(loginData models.LoginDTO) (models.User, error)
	Register(user models.RegisterDTO, password []byte) error
}

type AuthService struct {
	repo AuthRepositoryInterface
}

func NewAuthService(repo AuthRepositoryInterface) *AuthService {
	return &AuthService{repo: repo}
}

func (service AuthService) Login(loginData models.LoginDTO) (string, error) {
	err := service.repo.IsUserExists(loginData.Role, loginData.Login)
	if err != nil {
		return "", err
	}

	userData, err := service.repo.Login(loginData)
	if err != nil {
		return "", err
	}

	payload := jwt.MapClaims{
		"exp":   time.Now().Add(time.Minute * 60).Unix(),
		"id": 	 userData.Id,
		"login": userData.Login,
		"role": loginData.Role,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)

	JWT_SECRET_KEY, _ := os.LookupEnv("JWT_SECRET_KEY")

	t, err := token.SignedString([]byte(JWT_SECRET_KEY))
	if err != nil {
		return "", err
	}

	return t, err
}

func (service AuthService) Register(patient models.RegisterDTO) error {
	err := service.repo.IsUserExists("patient", patient.Login)
	if err == nil {
		return custom_errors.ErrExistingLogin
	}

	passHash, err := bcrypt.GenerateFromPassword([]byte(patient.Password), 14)
	if err != nil {
		return err
	}

	err = service.repo.Register(patient, passHash)
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