package custom_errors

import "errors"

var (
	ErrTokenNotProvided = errors.New("token was not provided")
	ErrInvalidToken = errors.New("provided token is invalid")
	ErrExpiredToken = errors.New("provided token is expired")
	ErrWrongPassword = errors.New("provided password is wrong")
	ErrExistingLogin = errors.New("user with such login already exists")
	ErrUnexistingLogin = errors.New("user with such login does not exist")
	ErrActionNotAllowed = errors.New("you are not allowed to take this action")
	ErrNoPatientWithSuchId = errors.New("there is no patient with such id")
)