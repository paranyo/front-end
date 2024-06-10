import axios, { Axios, AxiosRequestConfig } from 'axios';

interface APIResponse<T> {
  statusCode: number
  errorCode: number
  message: string
  result: T
  timestamp: Date
}

// TODO: Axios 라이브러리에서 import한 Response 인터페이스
// interface AxiosResponse<T = any, D = any> {
//   data: T
//   status: number
//   statusText: string
//   headers: RawAxiosResponseHeaders | AxiosResponseHeaders
//   config: InternalAxiosRequestConfig<D>
//   request?: any
// }


const client: Axios = axios.create({
  baseURL: 'https://api.mooluck.xyz/v1/',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://api.mooluck.xyz'
  },
  withCredentials: true,
})

export const getData = async <T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
  try {
    const response = await client.get<APIResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error.message);
    else throw new Error("신박한 에러");
  }
};

export const postData = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
  try {
    const response = await client.post<APIResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error.message);
    else throw new Error("신박한 에러");
  }
};