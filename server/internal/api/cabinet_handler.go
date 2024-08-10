package api

import (
	"net/http"
	"server/internal/models"

	"github.com/gin-gonic/gin"
)

type CabinetServiceInterface interface {
	GetCabinets() ([]models.Cabinet, error)
	AddCabinet(cabinet models.Cabinet) error
	EditCabinet(cabinet models.Cabinet) error 
	DeleteCabinet(cabinet models.DeleteCabinetDTO) error
}

type CabinetHandler struct {
	service CabinetServiceInterface
}

func NewCabinetHandler(service CabinetServiceInterface) *CabinetHandler {
	return &CabinetHandler{service: service}
}

func (handler *CabinetHandler) GetCabinets(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	cabinets, err := handler.service.GetCabinets()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"cabinets": cabinets})
}

func (handler *CabinetHandler) AddCabinet(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.Cabinet
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err = handler.service.AddCabinet(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *CabinetHandler) EditCabinet(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.Cabinet
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err = handler.service.EditCabinet(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *CabinetHandler) DeleteCabinet(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.DeleteCabinetDTO
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err = handler.service.DeleteCabinet(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}