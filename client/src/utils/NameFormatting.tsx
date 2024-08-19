import { Patient } from "../types/Auth.types";
import { Doctor } from "../types/Doctor.types";

export const getShortName = (el: Doctor | Patient) => {
  return el.last_name + " " + el.first_name[0] + ". " + el.second_name[0] + ".";
};

export const getFullName = (el: Doctor | Patient) => {
  return el.last_name + " " + el.first_name + " " + el.second_name;
};
