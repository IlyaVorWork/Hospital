package repositories

import (
	"database/sql"
	"fmt"
	"server/internal/models"
	"server/pkg/custom_errors"

	"golang.org/x/crypto/bcrypt"
)

var (
	GET_PATIENT_DATA = "SELECT id, login, last_name, first_name, second_name, birth_date, sex_id, passport_series, passport_number, issue_date, issuer, snils_number FROM public.patient WHERE id = $1"
	GET_USER_BY_LOGIN = "SELECT id, login, password FROM public.%s WHERE login = $1"
	GET_PATIENT_BY_ID = "SELECT id, login, password FROM public.patient WHERE id = $1"
	REGISTER = "INSERT INTO public.patient(login, password, last_name, first_name, second_name, birth_date, sex_id, passport_series, passport_number, issue_date, issuer, snils_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"
)

type AuthRepository struct{
	db *sql.DB
}

func NewAuthRepository(db *sql.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (repo AuthRepository) GetPatientData(id int) (models.Patient, error) {
	var userData models.Patient

	err := repo.db.QueryRow(GET_PATIENT_DATA, id).Scan(&userData.Id, &userData.Login, &userData.Last_name, 
													   &userData.First_name, &userData.Second_name, &userData.Birth_date, 
													   &userData.Sex_id, &userData.Passport_series, &userData.Passport_number,
													   &userData.Issue_date, &userData.Issuer, &userData.Snils_number)

	if err != nil {
		return models.Patient{}, custom_errors.ErrNoPatientWithSuchId
	}

	return userData, nil
}

func (repo AuthRepository) IsUserExists(role, login string) error {

	var user models.User

	err := repo.db.QueryRow(fmt.Sprintf(GET_USER_BY_LOGIN, role), login).Scan(&user.Id, &user.Login, &user.Password)
	
	if err != nil {
		return custom_errors.ErrUnexistingLogin
	}

	return nil
}

func (repo AuthRepository) Login(loginData models.LoginDTO) (models.User, error) {
	var data models.User
	
	err := repo.db.QueryRow(fmt.Sprintf(GET_USER_BY_LOGIN, loginData.Role), loginData.Login).Scan(&data.Id, &data.Login, &data.Password)
	if err != nil {
		return models.User{}, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(data.Password), []byte(loginData.Password))
	if err != nil {
		return models.User{}, custom_errors.ErrWrongPassword
	}

	return data, nil
}

func (repo AuthRepository) Register(patient models.RegisterDTO, passHash []byte) error {
	
	_, err := repo.db.Exec(REGISTER, patient.Login, passHash, patient.Last_name, patient.First_name, patient.Second_name, 
									 patient.Birth_date, patient.Sex_id, patient.Passport_series, patient.Passport_number, 
									 patient.Issue_date, patient.Issuer, patient.Snils_number)

	if err != nil {
		return err
	}

	return nil
}