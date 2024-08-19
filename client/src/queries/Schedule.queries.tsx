import axios, { AxiosError, AxiosResponse } from "axios";
import {
  DeleteScheduleData,
  GetScheduleData,
  GetTimesData,
  MakeScheduleData,
} from "../types/Schedule.types";
import { CallErrorNotification } from "../utils/NotificationCall";
import { ErrorRes } from "../types/Auth.types";

export const GetFreeTimesMutation = (
  token: string,
  data: GetTimesData,
  onSuccess: (
    data: AxiosResponse<any, any>,
    variables: void,
    context: unknown
  ) => Promise<unknown> | void
) => {
  return {
    mutationFn: () => {
      return axios({
        headers: { Authorization: token },
        method: "post",
        url: "http://localhost:8080/schedule/getFreeTimes",
        data: data,
      });
    },
    onSuccess: onSuccess,
  };
};

export const MakeScheduleMutation = (
  token: string,
  data: MakeScheduleData,
  onSuccess: (
    data: AxiosResponse<any, any>,
    variables: void,
    context: unknown
  ) => Promise<unknown> | void
) => {
  return {
    mutationFn: () => {
      return axios({
        headers: { Authorization: token },
        method: "post",
        url: "http://localhost:8080/schedule/makeSchedule",
        data: data,
      });
    },
    onSuccess: onSuccess,
    onError: (error: AxiosError) => {
      let err: ErrorRes = error.response?.data as ErrorRes;
      CallErrorNotification(err.error[0].toUpperCase() + err.error.slice(1));
    },
  };
};

export const GetScheduleMutation = (
  token: string,
  data: GetScheduleData,
  onSuccess: (
    data: AxiosResponse<any, any>,
    variables: void,
    context: unknown
  ) => Promise<unknown> | void
) => {
  return {
    mutationFn: () => {
      return axios({
        headers: { Authorization: token },
        method: "post",
        url: "http://localhost:8080/schedule/getSchedule",
        data: data,
      });
    },
    onSuccess: onSuccess,
  };
};

export const DeleteScheduleMutation = (
  token: string,
  data: DeleteScheduleData,
  onSuccess: (
    data: AxiosResponse<any, any>,
    variables: void,
    context: unknown
  ) => Promise<unknown> | void
) => {
  return {
    mutationFn: () => {
      return axios({
        headers: { Authorization: token },
        method: "delete",
        url: "http://localhost:8080/schedule/deleteSchedule",
        data: data,
      });
    },
    onSuccess: onSuccess,
    onError: (error: AxiosError) => {
      let err: ErrorRes = error.response?.data as ErrorRes;
      CallErrorNotification(err.error[0].toUpperCase() + err.error.slice(1));
    },
  };
};
