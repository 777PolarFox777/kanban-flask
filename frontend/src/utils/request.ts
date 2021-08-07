import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const errorHandler = (err: AxiosError | Error) => {
  const axiosError = err as AxiosError;
  if (axiosError.isAxiosError) {
    console.error(`Request to ${axiosError.request.url} failed with code ${axiosError.code}`, axiosError.response?.data.message ?? axiosError.message, axiosError.stack);
  } else {
    console.error(err);
  }
};

const get = <T = any>(url: string, config?: AxiosRequestConfig) => axios
  .get<T>(url, config).catch(errorHandler);

const post = <T = any>(url: string, data: any, config?: AxiosRequestConfig) => axios
  .post<T>(url, data, config).catch(errorHandler);

const deleteMethod = <T = any>(url: string, config?: AxiosRequestConfig) => axios
  .delete<T>(url, config).catch(errorHandler);

const put = <T = any>(url: string, data: any, config?: AxiosRequestConfig) => axios
  .put<T>(url, data, config).catch(errorHandler);

export const request = {
  get,
  post,
  delete: deleteMethod,
  put,
};
