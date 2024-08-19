export interface Time {
  id: number;
  time: string;
}

export interface MakeScheduleData {
  date: Date;
  specialization_id: number;
  doctor_id: number;
  time_ids: number[];
}

export interface GetScheduleData {
  date: Date;
  doctor_id: number;
}

export interface GetTimesData {
  date: Date;
  doctor_id: number;
  specialization_id: number;
}

export interface DeleteScheduleData {
  date: Date;
  doctor_id: number;
  time_ids: number[];
}
