package api

import (
	"fmt"
	"net/http"
	"os"
	"server/internal/models"
	customError "server/pkg/custom_errors"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type AuthServiceInterface interface {
	Login(loginData models.LoginDTO) (string, error)
	Register(patient models.RegisterDTO) error
	GetPatientData(id int) (models.Patient, error)
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
		return claims, customError.ErrTokenNotProvided
	}

	JWT_SECRET_KEY, _ := os.LookupEnv("JWT_SECRET_KEY")

	_, err := jwt.ParseWithClaims(access_token, &claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(JWT_SECRET_KEY), nil
	})
	if err != nil {
		return claims, customError.ErrInvalidToken
	}

	expired := claims.VerifyExpiresAt(time.Now().Unix(), true)
	if !expired {
		return claims, customError.ErrExpiredToken
	}

	if claims.Role != role {
		return claims, customError.ErrActionNotAllowed
	}

	return claims, nil
}

func (handler *AuthHandler) Register(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.RegisterDTO
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	fmt.Println(queryData)

	err = handler.service.Register(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, "пациент успешно зарегистрирован")
}

func (handler *AuthHandler) Login(c *gin.Context) {
	var queryData models.LoginDTO
	err := c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	token, err := handler.service.Login(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Access_token": token})
}

func (handler *AuthHandler) GetUserData(c *gin.Context) {

	tokenClaims, err := VerifyToken(c, "patient")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	patientData, err := handler.service.GetPatientData(tokenClaims.Id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"PatientData": patientData})
}