package custom_errors

import "errors"

var (
	ErrTokenNotProvided = errors.New("токен аутентификации не был предоставлен")
	ErrInvalidToken = errors.New("предоставленный токен недействителен")
	ErrExpiredToken = errors.New("предоставленный токен истёк")
	ErrWrongPassword = errors.New("неверный пароль")
	ErrExistingLogin = errors.New("пользователь с таким логином уже существует")
	ErrUnexistingLogin = errors.New("пользователя с таким логином не существует")
	ErrActionNotAllowed = errors.New("вы не можете совершить это действие")
	ErrNoPatientWithSuchId = errors.New("пациента с таким id не существует")
	ErrExistingCabinet = errors.New("кабинет с таким номером уже существует")
)