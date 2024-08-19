export interface Ticket {
  date: Date;
  cabinet_number: number;
  time_id: number;
  time: string;
}

export interface AppointmentData {
  date: Date;
  cabinet_number: number;
  time_id: number;
}

export interface Appointment {
  date: Date;
  cabinet_number: number;
  specialization_id: number;
  specialization: string;
  time_id: number;
  time: string;
  doctor_id: number;
  last_name: string;
  first_name: string;
  second_name: string;
  img_url: string;
}
