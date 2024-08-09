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

	authService := service.NewAuthService(authRepo)
	specService := service.NewSpecializationService(specRepo)
	doctorService := service.NewDoctorService(doctorRepo)
	scheduleService := service.NewScheduleService(scheduleRepo)

	authHandler := api.NewAuthHandler(authService)
	specHandler := api.NewSpecializationHandler(specService)
	doctorHandler := api.NewDoctorHandler(doctorService)
	scheduleHandler := api.NewScheduleHandler(scheduleService)


	r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"POST", "GET", "PATCH"},
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

	Appoint := r.Group("/appointment")
	{
		Appoint.GET("/specializations", specHandler.GetSpecializations)
		Appoint.GET("/doctors", doctorHandler.GetDoctorsBySpec)
		Appoint.GET("/tickets", scheduleHandler.GetFreeTickets)
		Appoint.POST("/makeAppointment", scheduleHandler.MakeAppointment)
		Appoint.GET("/getPatientAppointments", scheduleHandler.GetAppointmentsByPatientId)
		Appoint.PATCH("/cancelAppointment", scheduleHandler.CancelAppointment)
	}

	err := r.Run()
	if err != nil {
		panic(err)
	}
}