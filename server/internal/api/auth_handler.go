package api

import (
	"net/http"
	"os"
	"server/internal/models"
	CustomError "server/pkg/custom_errors"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type AuthServiceInterface interface {
	LoginUser(data models.LoginDTO) (string, error)
	RegisterPatient(data models.RegisterDTO) error
	GetPatientData(id int) (models.Patient, error)
	ChangePassword(data models.ChangePasswordDTO) error
	GetPatients() ([]models.Patient, error)
}

type AuthHandler struct {
	service AuthServiceInterface
}

func NewAuthHandler(service AuthServiceInterface) *AuthHandler {
	return &AuthHandler{service: service}
}

func VerifyToken(c *gin.Context, role string) (models.TokenClaims, error) {
	claims := models.TokenClaims{}
	
	access_token := c.Request.Header.Get("Authorization")
	if access_token == "" {
		return claims, CustomError.ErrTokenNotProvided
	}

	JWT_SECRET_KEY, _ := os.LookupEnv("JWT_SECRET_KEY")

	_, err := jwt.ParseWithClaims(access_token, &claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(JWT_SECRET_KEY), nil
	})
	if err != nil {
		return claims, CustomError.ErrInvalidToken
	}

	expired := claims.VerifyExpiresAt(time.Now().Unix(), true)
	if !expired {
		return claims, CustomError.ErrExpiredToken
	}


	if role != "any" && claims.Role != role {
		return claims, CustomError.ErrActionNotAllowed
	}

	return claims, nil
}

func (handler *AuthHandler) RegisterPatient(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var query_data models.RegisterDTO
	err = c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = handler.service.RegisterPatient(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, "пациент успешно зарегистрирован")
}

func (handler *AuthHandler) LoginUser(c *gin.Context) {
	var query_data models.LoginDTO
	err := c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := handler.service.LoginUser(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Access_token": token})
}

func (handler *AuthHandler) GetPatientData(c *gin.Context) {

	token_claims, err := VerifyToken(c, "patient")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	patientData, err := handler.service.GetPatientData(token_claims.Id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"patient_data": patientData})
}

func (handler *AuthHandler) ChangePassword(c *gin.Context) {

	token_claims, err := VerifyToken(c, "patient")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var query_data models.ChangePasswordDTO
	err = c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query_data.Patient_Id = token_claims.Id

	err = handler.service.ChangePassword(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *AuthHandler) GetPatients(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	patients, err := handler.service.GetPatients()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"patients": patients})
}

