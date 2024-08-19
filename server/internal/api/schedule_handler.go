package api

import (
	"net/http"
	"server/internal/models"

	"github.com/gin-gonic/gin"
)

type ScheduleServiceInterface interface {
	GetFreeTimes(data models.GetFreeTimesDTO) ([]models.Time, error)
	GetSchedule(data models.GetScheduleDTO) ([]models.Time, error)
	MakeSchedule(data models.MakeScheduleDTO) error
	DeleteSchedule(data models.DeleteScheduleDTO) error
}

type ScheduleHandler struct {
	service ScheduleServiceInterface
}

func NewScheduleHandler(service ScheduleServiceInterface) *ScheduleHandler {
	return &ScheduleHandler{service: service}
}

func (handler *ScheduleHandler) GetFreeTimes(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var query_data models.GetFreeTimesDTO
	err = c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	times, err := handler.service.GetFreeTimes(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"times": times})
}

func (handler *ScheduleHandler) GetSchedule(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var query_data models.GetScheduleDTO
	err = c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	times, err := handler.service.GetSchedule(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"times": times})
}

func (handler *ScheduleHandler) MakeSchedule(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var query_data models.MakeScheduleDTO
	err = c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = handler.service.MakeSchedule(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}

func (handler *ScheduleHandler) DeleteSchedule(c *gin.Context) {

	_, err := VerifyToken(c, "admin")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var query_data models.DeleteScheduleDTO
	err = c.ShouldBindJSON(&query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = handler.service.DeleteSchedule(query_data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Result": "success"})
}