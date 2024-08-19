package api

import (
	"net/http"
	"server/internal/models"

	"github.com/gin-gonic/gin"
)

type DataServiceInterface interface {
	GetSpecializationsWithFreeTickets() ([]models.Specialization, error)
	GetGenders() ([]models.Gender, error)
}

type DataHandler struct {
	service DataServiceInterface
}

func NewDataHandler(service DataServiceInterface) *DataHandler {
	return &DataHandler{service: service}
}

func (handler *DataHandler) GetSpecializationsWithFreeTickets(c *gin.Context) {
	
	_, err := VerifyToken(c, "any")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	specializations, err := handler.service.GetSpecializationsWithFreeTickets()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"specializations": specializations})
}

func (handler *DataHandler) GetGenders(c *gin.Context) {
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	genders, err := handler.service.GetGenders()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"genders": genders})
}