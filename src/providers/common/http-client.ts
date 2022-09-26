import { Injectable, Logger, Scope } from '@nestjs/common';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';

/**
 * HTTP request client
 */
@Injectable({ scope: Scope.TRANSIENT })
export class HttpClient {
  private static readonly logger = new Logger(HttpClient.name);
  readonly client: AxiosInstance;

  constructor(
    headers?: AxiosRequestHeaders,
    handleSuccess: any = HttpClient.defaultHandleSuccess,
    handleError: any = HttpClient.defaultHandleError,
  ) {
    const client = axios.create({
      headers: { 'Content-Type': 'application/json', ...headers },
    });
    client.interceptors.request.use(this.logRequest);
    client.interceptors.response.use(this.logResponse);
    client.interceptors.response.use(handleSuccess, handleError);

    this.client = client;
  }

  async get(url: string, config?: AxiosRequestConfig) {
    const response = this.client.request({
      method: 'GET',
      url,
      responseType: 'json',
      ...config,
    });
    // console.log('Response promise: %o', response);
    return response;
  }

  async patch(url: string, body: any, config?: AxiosRequestConfig) {
    return this.client.request({
      method: 'PATCH',
      url,
      responseType: 'json',
      data: body,
      ...config,
    });
  }

  async post(url: string, body: any, config?: AxiosRequestConfig) {
    return this.client.request({
      method: 'POST',
      url,
      responseType: 'json',
      data: body,
      ...config,
    });
  }

  async delete(url: string, body: any, config?: AxiosRequestConfig) {
    return this.client.request({
      method: 'DELETE',
      url,
      responseType: 'json',
      data: body,
      ...config,
    });
  }

  async put(url: string, body: any, config?: AxiosRequestConfig) {
    return this.client.request({
      method: 'PUT',
      url,
      responseType: 'json',
      data: body,
      ...config,
    });
  }

  private logRequest(request: AxiosRequestConfig) {
    HttpClient.logger.log('Sending request to: %s', request?.url);
    return request;
  }

  private logResponse(response: AxiosResponse) {
    HttpClient.logger.log('Received response data: %o', response?.data);
    return response;
  }

  private static async defaultHandleSuccess(response: AxiosResponse) {
    return response;
  }

  private static defaultHandleError(error: any) {
    return Promise.reject(error);
  }
}
