package api

import (
	"net/http"
	"server/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type DoctorServiceInterface interface {
	GetDoctorsBySpec(spec_id int) ([]models.Doctor, error)
	GetDoctors() ([]models.Doctor, error)
	AddDoctor(data models.AddDoctorDTO) error
	EditDoctor(data models.EditDoctorDTO) error
	DeleteDoctor(data models.DeleteDoctorDTO) error
}

type DoctorHandler struct {
	service DoctorServiceInterface
}

func NewDoctorHandler(service DoctorServiceInterface) *DoctorHandler {
	return &DoctorHandler{service: service}
}

func (handler *DoctorHandler) GetDoctorsBySpec(c *gin.Context) {
	
	_, err := VerifyToken(c, "any")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	spec_id, err := strconv.Atoi(c.Request.URL.Query()["spec_id"][0])
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	doctors, err := handler.service.GetDoctorsBySpec(spec_id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"doctors": doctors})
}

func (handler *DoctorHandler) GetDoctors(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	doctors, err := handler.service.GetDoctors()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"doctors": doctors})
}

func (handler *DoctorHandler) AddDoctor(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var query_data models.AddDoctorDTO
	err = c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = handler.service.AddDoctor(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *DoctorHandler) EditDoctor(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var query_data models.EditDoctorDTO
	err = c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = handler.service.EditDoctor(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *DoctorHandler) DeleteDoctor(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var query_data models.DeleteDoctorDTO
	err = c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = handler.service.DeleteDoctor(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}