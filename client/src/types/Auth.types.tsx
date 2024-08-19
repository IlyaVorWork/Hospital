export type Role = "patient" | "admin";

export interface LoginData {
  role: string;
  login: string;
  password: string;
}

export interface RegisterPatientForm {
  login: string;
  password: string;
  last_name: string;
  first_name: string;
  second_name: string;
  gender_id: number;
  birth_date: Date;
  passport_series: string;
  passport_number: string;
  issuer: string;
  issue_date: Date;
  snils_number: string;
}

export interface TokenClaims {
  exp: number;
  id: number;
  login: string;
  role: Role;
}

export interface ErrorRes {
  error: string;
}

export interface Patient {
  id: number;
  login: string;
  last_name: string;
  first_name: string;
  second_name: string;
  birth_date: Date;
  sex_id: number;
  passport_series: string;
  passport_number: string;
  issue_date: Date;
  issuer: string;
  snils_number: number;
}
