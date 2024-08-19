import axios, { AxiosResponse } from "axios";

export const GetGendersMutation = (
  token: string,
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
        method: "get",
        url: "http://localhost:8080/data/getGenders",
      });
    },
    onSuccess: onSuccess,
  };
};

export const GetSpecializationsMutation = (
  token: string,
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
        method: "get",
        url: "http://localhost:8080/data/getSpecializations",
      });
    },
    onSuccess: onSuccess,
  };
};
