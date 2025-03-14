import {AxiosResponse} from 'axios';

export type RequestError = {
  response: AxiosResponse<unknown>;
};

export enum ApiErrorTypes {
  KeyNotPresent = 'KeyNotPresent',
  RefreshFailed = 'RefreshFailed',
  NetworkError = 'NetworkError',
  Canceled = 'Canceled',
  NotFound = 'NotFound',
}
