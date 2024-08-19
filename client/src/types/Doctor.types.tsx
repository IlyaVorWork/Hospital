export interface Doctor {
  id: number;
  last_name: string;
  first_name: string;
  second_name: string;
  specialization_id: number;
  img_url: string;
  ticket_count: number;
}

export interface AddDoctorData {
  last_name: string;
  first_name: string;
  second_name: string;
  specialization_id: number;
  img_url: string;
}

export interface EditDoctorData {
  id: number;
  last_name: string;
  first_name: string;
  second_name: string;
  img_url: string;
}
