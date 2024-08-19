package main

import (
	"log"
	"server/internal/api"
	"server/internal/repositories"
	"server/internal/service"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
/*
	passHash, err := bcrypt.GenerateFromPassword([]byte("admin"), 14)
	fmt.Println(string(passHash[:]))*/

	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	r := gin.Default()
	
	db := repositories.ConnectDB()

	authRepo := repositories.NewAuthRepository(db)
	dataRepo := repositories.NewDataRepository(db)
	doctorRepo := repositories.NewDoctorRepository(db)
	cabinetRepo := repositories.NewCabinetRepository(db)
	appointmentRepo := repositories.NewAppointmentRepository(db)
	scheduleRepo := repositories.NewScheduleRepository(db)

	authService := service.NewAuthService(authRepo)
	dataService := service.NewDataService(dataRepo)
	doctorService := service.NewDoctorService(doctorRepo)
	scheduleService := service.NewScheduleService(scheduleRepo)
	cabinetService := service.NewCabinetService(cabinetRepo)
	appointmentService := service.NewAppointmentService(appointmentRepo)

	authHandler := api.NewAuthHandler(authService)
	dataHandler := api.NewDataHandler(dataService)
	doctorHandler := api.NewDoctorHandler(doctorService)
	scheduleHandler := api.NewScheduleHandler(scheduleService)
	cabinetHandler := api.NewCabinetHandler(cabinetService)
	appointmentHandler := api.NewAppointmentHandler(appointmentService)


	r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"POST", "GET", "PATCH", "DELETE"},
        AllowHeaders:     []string{"Authorization", "Content-type"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))

	auth := r.Group("/auth")
	{
		auth.POST("/register", authHandler.RegisterPatient)
		auth.POST("/login", authHandler.LoginUser)
		auth.PATCH("/changePassword", authHandler.ChangePassword)
		auth.GET("/getPatientData", authHandler.GetPatientData)
		auth.GET("/getPatients", authHandler.GetPatients)
	}

	data := r.Group("/data")
	{
		data.GET("/getGenders", dataHandler.GetGenders)
		data.GET("/getSpecializations", dataHandler.GetSpecializationsWithFreeTickets)
	}

	cabinet := r.Group("/cabinet")
	{
		cabinet.GET("/getCabinets", cabinetHandler.GetCabinets)
		cabinet.POST("/addCabinet", cabinetHandler.AddCabinet)
		cabinet.PATCH("/editCabinet", cabinetHandler.EditCabinet)
		cabinet.DELETE("/deleteCabinet", cabinetHandler.DeleteCabinet)
	}

	doctor := r.Group("/doctor")
	{
		doctor.GET("/getDoctors", doctorHandler.GetDoctors)
		doctor.GET("/getDoctorsBySpecializationId", doctorHandler.GetDoctorsBySpec)
		doctor.POST("/addDoctor", doctorHandler.AddDoctor)
		doctor.PATCH("/editDoctor", doctorHandler.EditDoctor)
		doctor.DELETE("/deleteDoctor", doctorHandler.DeleteDoctor)
	}

	schedule := r.Group("/schedule")
	{
		schedule.POST("/getFreeTimes", scheduleHandler.GetFreeTimes)
		schedule.POST("/getSchedule", scheduleHandler.GetSchedule)
		schedule.POST("/makeSchedule", scheduleHandler.MakeSchedule)
		schedule.DELETE("/deleteSchedule", scheduleHandler.DeleteSchedule)
	}

	appointment := r.Group("/appointment")
	{
		appointment.POST("/makeAppointment", appointmentHandler.MakeAppointment)
		appointment.GET("/getFreeAppointments", appointmentHandler.GetFreeAppointments)
		appointment.GET("/getAppointmentsByPatientId", appointmentHandler.GetAppointmentsByPatientId)
		appointment.PATCH("/cancelAppointment", appointmentHandler.CancelAppointment)
	}

	err := r.Run()
	if err != nil {
		panic(err)
	}
}