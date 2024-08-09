package api

import (
	"net/http"
	"server/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type DoctorServiceInterface interface {
	GetDoctorsBySpec(id_spec int) ([]models.Doctor, error)
}

type DoctorHandler struct {
	service DoctorServiceInterface
}

func NewDoctorHandler(service DoctorServiceInterface) *DoctorHandler {
	return &DoctorHandler{service: service}
}

func (handler *DoctorHandler) GetDoctorsBySpec(c *gin.Context) {
	
	_, err := VerifyToken(c, "patient")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	id_spec, err := strconv.Atoi(c.Request.URL.Query()["id_spec"][0])
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	doctors, err := handler.service.GetDoctorsBySpec(id_spec)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"doctors": doctors})
}