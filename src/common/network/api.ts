import type {AxiosResponse} from 'axios';
import axiosModule, {AxiosHeaders} from 'axios';
import {ApiErrorTypes} from './types';
import {TProduct} from '../../features/Products/screens/types';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=UTF-8',
};

let abortController = new AbortController();

export const resetAbortController = () => {
  abortController = new AbortController();
};

// Можно использовать в фичах
export const axios = axiosModule.create();

// Request interceptor for API calls
axios.interceptors.request.use(
  async config => {
    config.signal = config.signal || abortController.signal;
    const Authorization = 'Bearer qwerty';
    config.timeout = config?.timeout || 60000;
    config.headers = new AxiosHeaders({
      ...defaultHeaders,
      Authorization,
    });
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

let refreshPromise: Promise<string> | null = null;

const makeRefreshToken = async () => {
  return '';
};

const sendToAnalytics = async (e: Error) => {
  try {
    // await yaMetrica.send(...)
    console.log('Отправка ошибки в аналитику', {
      e,
      where: 'axiosRequestError',
    });
  } catch (e) {
    // Делаем что-то, если запрос в аналитику не получилось отправить (?)
  }
};

// Response interceptor for API calls
axios.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    if (error.response?.status === 404) {
      return Promise.reject(ApiErrorTypes.NotFound);
    }
    const originalRequest = error.config;
    const isAccesRestricted = [403].includes(error.response?.status); // Конец доступа в систему
    // пытаемся обновить токен по рефреш токену, если такой попытки раньше не было
    const isExpiredToken = !![401].includes(error.response?.status);
    if (
      isExpiredToken &&
      originalRequest.headers.Authorization &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (refreshPromise === null) {
        refreshPromise = makeRefreshToken();
      }
      const newToken = await refreshPromise;
      refreshPromise = null;
      if (newToken) {
        const newAuthHeader = `${originalRequest.headers.Authorization.split(' ')[0]} ${newToken}`;
        originalRequest.headers.Authorization = newAuthHeader;
        return axios(originalRequest);
      }
    }
    sendToAnalytics(error);
    // abortController.abort(); // отменяем все текущие запросы
    // Обновить токен не получилось, отправляем ошибку + разлогин
    if (isExpiredToken || isAccesRestricted) {
      // signOutFunc()
      return Promise.reject(ApiErrorTypes.RefreshFailed);
    }
    if (error.config?.headers?.fullError) {
      return Promise.reject(error);
    }
    return Promise.reject(error?.response?.data || JSON.stringify(error));
  },
);

export type RequestError = {
  response: AxiosResponse<unknown>;
};

export class CommonApi {
  apiUrl = 'https://example.com';
  // Получить товары
  getProducts = async ({
    page = 1,
    requestUrl,
  }: {
    page?: number;
    requestUrl?: string;
  }) => {
    console.log('requestUrl', requestUrl);
    const url = requestUrl || `${this.apiUrl}/api/get-products/?page=${page}`;
    const resp = await axios.get<{results: TProduct[]; next: string}>(url);
    return resp.data;
  };
  buyProducts = async (data: {
    ids: number[];
    price: number;
    errorType: string;
  }) => {
    const url = `${this.apiUrl}/api/buy-products/`;
    const resp = await axios.post(url, data);
    return resp.data;
  };
}

const api = new CommonApi();

export {api};
