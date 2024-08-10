package api

import (
	"net/http"
	"server/internal/models"

	"github.com/gin-gonic/gin"
)

type SpecializationServiceInterface interface {
	GetSpecializationsWithFreeTickets() ([]models.SpecializationWithFreeTickets, error)
	GetSpecializations() ([]models.Specialization, error)
}

type SpecializationHandler struct {
	service SpecializationServiceInterface
}

func NewSpecializationHandler(service SpecializationServiceInterface) *SpecializationHandler {
	return &SpecializationHandler{service: service}
}

func (handler *SpecializationHandler) GetSpecializationsWithFreeTickets(c *gin.Context) {
	
	_, err := VerifyToken(c, "patient")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	specializations, err := handler.service.GetSpecializationsWithFreeTickets()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"specializations": specializations})
}

func (handler *SpecializationHandler) GetSpecializations(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	specializations, err := handler.service.GetSpecializations()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"specializations": specializations})
}