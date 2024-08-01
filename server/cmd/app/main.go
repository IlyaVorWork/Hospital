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
	authService := service.NewAuthService(authRepo)
	authHandler := api.NewAuthHandler(authService)


	r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"POST", "GET"},
        AllowHeaders:     []string{"Authorization", "Content-type"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))


	user := r.Group("/auth")
	{
		user.POST("/register", authHandler.Register)
		user.POST("/login", authHandler.Login)
		user.GET("/getUserData", authHandler.GetUserData)
	}

	err := r.Run()
	if err != nil {
		panic(err)
	}
}