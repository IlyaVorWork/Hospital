package models

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

type TokenClaims struct {
	Id int `json:"id"`
	Login string   `json:"login"`
	Role string `json:"role"`
	jwt.StandardClaims
}

type Patient struct {
	Id          int       `json:"id"`
	Login       string    `json:"login"`
	Last_name   string    `json:"last_name"`
	First_name  string    `json:"first_name"`
	Second_name string    `json:"second_name"`
	Birth_date  time.Time `json:"birth_date"`
	Gender_id int `json:"gender_id"`
	Passport_series string `json:"passport_series"`
	Passport_number string `json:"passport_number"`
	Issue_date time.Time `json:"issue_date"`
	Issuer string `json:"issuer"`
	Snils_number string `json:"snils_number"`
}

type User struct {
	Id          int       `json:"id"`
	Login       string    `json:"login"`
	Password	string    `json:"password"`
}

type LoginDTO struct {
	Role string `json:"role" binding:"required"`
	Login string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterDTO struct {
	Login       string    `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
	Last_name   string    `json:"last_name" binding:"required"`
	First_name  string    `json:"first_name" binding:"required"`
	Second_name string    `json:"second_name" binding:"required"`
	Birth_date  time.Time `json:"birth_date" binding:"required"`
	Gender_id int `json:"gender_id" binding:"required"`
	Passport_series string `json:"passport_series" binding:"required"`
	Passport_number string `json:"passport_number" binding:"required"`
	Issue_date time.Time `json:"issue_date" binding:"required"`
	Issuer string `json:"issuer" binding:"required"`
	Snils_number string `json:"snils_number" binding:"required"`
}

type ChangePasswordDTO struct {
	Patient_Id int `json:"patient_id"`
	Password string `json:"password" binding:"required"`
}

