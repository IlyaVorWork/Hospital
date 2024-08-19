package api

import (
	"net/http"
	"server/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AppointmentServiceInterface interface {
	GetFreeAppointments(doctor_id int) ([]models.Ticket, error)
	MakeAppointment(data models.MakeAppointDTO) error
	GetAppointmentsByPatientId(patient_id int) ([]models.Appointment, error)
	CancelAppointment(data models.CancelAppointDTO) error
}

type AppointmentHandler struct {
	service AppointmentServiceInterface
}

func NewAppointmentHandler(service AppointmentServiceInterface) *AppointmentHandler {
	return &AppointmentHandler{service: service}
}

func (handler *AppointmentHandler) GetFreeAppointments(c *gin.Context) {

	_, err := VerifyToken(c, "patient")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	doctor_id, err := strconv.Atoi(c.Request.URL.Query()["doctor_id"][0])
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tickets, err := handler.service.GetFreeAppointments(doctor_id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"tickets": tickets})
}

func (handler *AppointmentHandler) MakeAppointment(c *gin.Context) {

	claims, err := VerifyToken(c, "patient")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var query_data models.MakeAppointDTO
	err = c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query_data.Patient_id = claims.Id

	err = handler.service.MakeAppointment(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *AppointmentHandler) GetAppointmentsByPatientId(c *gin.Context) {

	_, err := VerifyToken(c, "any")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	patient_id, err := strconv.Atoi(c.Request.URL.Query()["patient_id"][0])
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	appointments, err := handler.service.GetAppointmentsByPatientId(patient_id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"appointments": appointments})
}

func (handler *AppointmentHandler) CancelAppointment(c *gin.Context) {

	_, err := VerifyToken(c, "any")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var query_data models.CancelAppointDTO
	err = c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = handler.service.CancelAppointment(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}