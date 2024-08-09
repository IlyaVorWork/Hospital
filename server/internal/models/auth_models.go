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
	Sex_id int `json:"sex_id"`
	Passport_series int `json:"passport_series"`
	Passport_number int `json:"passport_number"`
	Issue_date time.Time `json:"issue_date"`
	Issuer string `json:"issuer"`
	Snils_number int `json:"snils_number"`
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
	Login       string    `json:"login"`
	Password string `json:"password"`
	Last_name   string    `json:"last_name"`
	First_name  string    `json:"first_name"`
	Second_name string    `json:"second_name"`
	Birth_date  time.Time `json:"birth_date"`
	Sex_id int `json:"sex_id"`
	Passport_series int `json:"passport_series"`
	Passport_number int `json:"passport_number"`
	Issue_date time.Time `json:"issue_date"`
	Issuer string `json:"issuer"`
	Snils_number int `json:"snils_number"`
}

type ChangePasswordDTO struct {
	Password string `json:"password"`
}