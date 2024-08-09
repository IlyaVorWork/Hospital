package repositories

import (
	"database/sql"
	"server/internal/models"
)

var (
	GET_TICKET_COUNT = "SELECT date, cabinet_number, time_id, time FROM schedule_view WHERE doctor_id = $1 and patient_id IS NULL ORDER BY time_id"
	UPDATE_SCHEDULE = "UPDATE public.schedule SET patient_id = $1 WHERE date = $2 and cabinet_number = $3 and time_id = $4;"
	GET_APPOINTMENTS_BY_PATIENT_ID = "SELECT date, cabinet_number, specialization, time_id, time, last_name, first_name, second_name, img_url FROM appointments_view WHERE patient_id = $1"
	CANCEL_APPOINTMENT = "UPDATE public.schedule SET patient_id = NULL WHERE date = $1 and cabinet_number = $2 and time_id = $3"
)

type ScheduleRepository struct {
	db *sql.DB
}

func NewScheduleRepository(db *sql.DB) *ScheduleRepository {
	return &ScheduleRepository{db: db}
}

func (repo ScheduleRepository) GetFreeTickets(id_doctor int) ([]models.Ticket, error) {
	var tickets []models.Ticket

	rows, err := repo.db.Query(GET_TICKET_COUNT, id_doctor)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var ticket models.Ticket
		err = rows.Scan(&ticket.Date, &ticket.Cabinet_number, &ticket.Time_id, &ticket.Time)
		if err != nil {
			return nil, err
		} 
		tickets = append(tickets, ticket)
	}

	return tickets, nil
}

func (repo ScheduleRepository) MakeAppointment(AppointData models.MakeAppointDTO) error {

	_, err := repo.db.Exec(UPDATE_SCHEDULE, AppointData.Patient_id, AppointData.Date, AppointData.Cabinet_number, AppointData.Time_id)
	if err != nil {
		return err
	}

	return nil
}

func (repo ScheduleRepository) GetAppointmentsByPatientId(patient_id int) ([]models.Appointment, error) {
	var appointments []models.Appointment

	rows, err := repo.db.Query(GET_APPOINTMENTS_BY_PATIENT_ID, patient_id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var appointment models.Appointment
		err = rows.Scan(&appointment.Date, &appointment.Cabinet_number, &appointment.Specialization, &appointment.Time_id, &appointment.Time, &appointment.Last_name, &appointment.First_name, &appointment.Second_name, &appointment.Img_url)
		if err != nil {
			return nil, err
		} 
		appointments = append(appointments, appointment)
	}

	return appointments, nil
}

func (repo ScheduleRepository) CancelAppointment(CancelAppointData models.CancelAppointDTO) error {
	_, err := repo.db.Exec(CANCEL_APPOINTMENT, CancelAppointData.Date, CancelAppointData.Cabinet_number, CancelAppointData.Time_id)
	if err != nil {
		return err
	} 

	return nil
}