package main

import (
	"log"
	"server/internal/api"
	"server/internal/repositories"
	"server/internal/service"

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