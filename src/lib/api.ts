import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { redirect } from 'next/navigation';
import token from '@/lib/token';

export const BASEURL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASEURL,
});

const log = (message: string, log?: AxiosResponse | InternalAxiosRequestConfig | AxiosError) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, log);
  }
};

api.interceptors.request.use((request) => {
  'use client';
  //const jwtToken: string | null = token.getToken("vrkjobs.access_token");
  const { method, url } = request;

  // if (jwtToken) {
  //   request.headers["Authorization"] = `Bearer ${jwtToken}`;
  // }

  log(`- [${method?.toUpperCase()}] ${url} | Request`, request);

  return request;
});

//   api.interceptors.response.use(
//     (response) => {
//       const { method, url } = response.config;
//       const { status } = response;

//       log(`- [${method?.toUpperCase()}] ${url} | Response ${status}`, response);
//       if (status === 401) {
//         "use client"
//         redirect("/login");
//       }
//       return response;
//     },
//     (error) => {
//       const { message } = error;
//       const { status, data } = error.response;
//       const { method, url } = error.config;

//       log(
//         `- [${method?.toUpperCase()}] ${url} | Error ${status} ${data?.message || ""} | ${message}`,
//         error
//       );
//       if (status === 401) {
//         console.log(true)
//         "use client"
//         window.location.replace('/auth/login')
//       }

//       return Promise.reject(error);
//     }
//   );

export default api;
