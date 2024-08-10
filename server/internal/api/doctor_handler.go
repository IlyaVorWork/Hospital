package api

import (
	"fmt"
	"net/http"
	"server/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type DoctorServiceInterface interface {
	GetDoctorsBySpec(id_spec int) ([]models.DoctorWithFreeTickets, error)
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

func (handler *DoctorHandler) GetDoctors(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	doctors, err := handler.service.GetDoctors()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"doctors": doctors})
}

func (handler *DoctorHandler) AddDoctor(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.AddDoctorDTO
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	fmt.Println(queryData)

	err = handler.service.AddDoctor(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *DoctorHandler) EditDoctor(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.EditDoctorDTO
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err = handler.service.EditDoctor(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *DoctorHandler) DeleteDoctor(c *gin.Context) {
	
	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.DeleteDoctorDTO
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err = handler.service.DeleteDoctor(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}