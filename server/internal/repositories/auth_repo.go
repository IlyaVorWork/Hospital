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
	REGISTER = "INSERT INTO public.patient(login, password, last_name, first_name, second_name, birth_date, sex_id, passport_series, passport_number, issue_date, issuer, snils_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"
	CHANGE_PASSWORD = "UPDATE public.patient SET password=$1 WHERE id = $2"
	GET_PATIENTS = "SELECT id, last_name, first_name, second_name, passport_number, passport_series FROM public.patient"
)

type AuthRepository struct{
	db *sql.DB
}

func NewAuthRepository(db *sql.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (repo AuthRepository) GetPatientData(id int) (models.Patient, error) {
	var patient models.Patient

	err := repo.db.QueryRow(GET_PATIENT_DATA, id).Scan(&patient.Id, &patient.Login, &patient.Last_name, 
													   &patient.First_name, &patient.Second_name, &patient.Birth_date, 
													   &patient.Gender_id, &patient.Passport_series, &patient.Passport_number,
													   &patient.Issue_date, &patient.Issuer, &patient.Snils_number)

	if err != nil {
		return models.Patient{}, custom_errors.ErrNoPatientWithSuchId
	}

	return patient, nil
}

func (repo AuthRepository) IsUserExists(role, login string) error {

	var user models.User

	err := repo.db.QueryRow(fmt.Sprintf(GET_USER_BY_LOGIN, role), login).Scan(&user.Id, &user.Login, &user.Password)
	
	if err != nil {
		return custom_errors.ErrUnexistingLogin
	}

	return nil
}

func (repo AuthRepository) LoginUser(data models.LoginDTO) (models.User, error) {
	var user models.User
	
	err := repo.db.QueryRow(fmt.Sprintf(GET_USER_BY_LOGIN, data.Role), data.Login).Scan(&user.Id, &user.Login, &user.Password)
	if err != nil {
		return models.User{}, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data.Password))
	if err != nil {
		return models.User{}, custom_errors.ErrWrongPassword
	}

	return user, nil
}

func (repo AuthRepository) RegisterPatient(data models.RegisterDTO, pass_hash []byte) error {
	
	_, err := repo.db.Exec(REGISTER, data.Login, pass_hash, data.Last_name, data.First_name, data.Second_name, 
		data.Birth_date, data.Gender_id, data.Passport_series, data.Passport_number, 
		data.Issue_date, data.Issuer, data.Snils_number)

	if err != nil {
		return err
	}

	return nil
}

func (repo AuthRepository) ChangePassword(patient_id int, pass_hash []byte) error {
	
	_, err := repo.db.Exec(CHANGE_PASSWORD, pass_hash, patient_id)

	if err != nil {
		return err
	}

	return nil
}

func (repo AuthRepository) GetPatients() ([]models.Patient, error) {
	var patients []models.Patient

	rows, err := repo.db.Query(GET_PATIENTS)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var patient models.Patient
		err = rows.Scan(&patient.Id, &patient.Last_name, &patient.First_name, &patient.Second_name, &patient.Passport_number, &patient.Passport_series)
		if err != nil {
			return nil, err
		}
		patients = append(patients, patient)
	}

	return patients, nil
}

