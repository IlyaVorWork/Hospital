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
	specRepo := repositories.NewSpecializationRepository(db)
	doctorRepo := repositories.NewDoctorRepository(db)
	scheduleRepo := repositories.NewScheduleRepository(db)
	cabinetRepo := repositories.NewCabinetRepository(db)

	authService := service.NewAuthService(authRepo)
	specService := service.NewSpecializationService(specRepo)
	doctorService := service.NewDoctorService(doctorRepo)
	scheduleService := service.NewScheduleService(scheduleRepo)
	cabinetService := service.NewCabinetService(cabinetRepo)

	authHandler := api.NewAuthHandler(authService)
	specHandler := api.NewSpecializationHandler(specService)
	doctorHandler := api.NewDoctorHandler(doctorService)
	scheduleHandler := api.NewScheduleHandler(scheduleService)
	cabinetHandler := api.NewCabinetHandler(cabinetService)


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
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.GET("/getPatientData", authHandler.GetPatientData)
		auth.PATCH("/changePassword", authHandler.ChangePassword)
	}

	appoint := r.Group("/appointment")
	{
		appoint.GET("/specializations", specHandler.GetSpecializationsWithFreeTickets)
		appoint.GET("/doctors", doctorHandler.GetDoctorsBySpec)
		appoint.GET("/tickets", scheduleHandler.GetFreeTickets)
		appoint.POST("/makeAppointment", scheduleHandler.MakeAppointment)
		appoint.GET("/getPatientAppointments", scheduleHandler.GetAppointmentsByPatientId)
		appoint.PATCH("/cancelAppointment", scheduleHandler.CancelAppointment)
	}

	specialization := r.Group("/specialization")
	{
		specialization.GET("/getSpecs", specHandler.GetSpecializations)
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
		doctor.POST("/addDoctor", doctorHandler.AddDoctor)
		doctor.PATCH("/editDoctor", doctorHandler.EditDoctor)
		doctor.DELETE("/deleteDoctor", doctorHandler.DeleteDoctor)
	}


	err := r.Run()
	if err != nil {
		panic(err)
	}
}