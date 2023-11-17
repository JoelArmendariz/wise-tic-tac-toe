import axios, { AxiosRequestConfig } from 'axios';

export const fetchGet = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  axios.get<T>(url, config).then(response => response.data);

export const fetchPost = <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> =>
  axios.post<T>(url, data, config).then(response => response.data);

export const fetchPut = <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> =>
  axios.put<T>(url, data, config).then(response => response.data);
