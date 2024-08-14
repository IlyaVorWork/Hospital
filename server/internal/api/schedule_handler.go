package api

import (
	"net/http"
	"server/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ScheduleServiceInterface interface {
	GetFreeTickets(doctor_id int) ([]models.Ticket, error)
	MakeAppointment(MakeAppointData models.MakeAppointDTO) error
	GetAppointmentsByPatientId(patient_id int) ([]models.Appointment, error)
	CancelAppointment(CancelAppointData models.CancelAppointDTO) error
	GetFreeTimes(ScheduleData models.GetFreeTimesDTO) ([]models.Time, error)
	MakeSchedule(ScheduleData models.MakeScheduleDTO) error
	GetSchedule(ScheduleData models.GetScheduleDTO) ([]models.Time, error)
	DeleteSchedule(ScheduleData models.DeleteScheduleDTO) error
}

type ScheduleHandler struct {
	service ScheduleServiceInterface
}

func NewScheduleHandler(service ScheduleServiceInterface) *ScheduleHandler {
	return &ScheduleHandler{service: service}
}

func (handler *ScheduleHandler) GetFreeTickets(c *gin.Context) {

	_, err := VerifyToken(c, "patient")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	id_doctor, err := strconv.Atoi(c.Request.URL.Query()["id_doctor"][0])
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	tickets, err := handler.service.GetFreeTickets(id_doctor)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"tickets": tickets})
}

func (handler *ScheduleHandler) MakeAppointment(c *gin.Context) {

	claims, err := VerifyToken(c, "patient")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.MakeAppointDTO
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	queryData.Patient_id = claims.Id

	err = handler.service.MakeAppointment(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *ScheduleHandler) GetAppointmentsByPatientId(c *gin.Context) {

	claims, err := VerifyToken(c, "patient")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	appointments, err := handler.service.GetAppointmentsByPatientId(claims.Id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"appointments": appointments})
}

func (handler *ScheduleHandler) CancelAppointment(c *gin.Context) {

	_, err := VerifyToken(c, "any")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.CancelAppointDTO
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err = handler.service.CancelAppointment(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *ScheduleHandler) GetAppointments(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	id_patient, err := strconv.Atoi(c.Request.URL.Query()["id_patient"][0])
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	appointments, err := handler.service.GetAppointmentsByPatientId(id_patient)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"appointments": appointments})
}

func (handler *ScheduleHandler) GetFreeTimes(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.GetFreeTimesDTO
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	times, err := handler.service.GetFreeTimes(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"times": times})
}

func (handler *ScheduleHandler) MakeSchedule(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.MakeScheduleDTO
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err = handler.service.MakeSchedule(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *ScheduleHandler) GetSchedule(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.GetScheduleDTO
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	times, err := handler.service.GetSchedule(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"times": times})
}

func (handler *ScheduleHandler) DeleteSchedule(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	var queryData models.DeleteScheduleDTO
	err = c.ShouldBindJSON(&queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err = handler.service.DeleteSchedule(queryData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}