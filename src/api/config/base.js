import axios from 'axios';
import { HEADERS } from './config';
import { requestInterceptor, requestInterceptorError, responseInterceptor, responseInterceptorError } from './interceptor';

/**
 * @description ajax请求 参数格式化方法
 * @param {Object} data
 * @param {Object} headers
 */
const requestTransform = function(data) {
  let dataArr = [];
  for (let key in data) {
    const encodeKey = encodeURIComponent(key);
    const encodeVal = encodeURIComponent(data[key]);
    dataArr.push(encodeKey + '=' + encodeVal);
  }
  return dataArr.join('&');
};

const getMethodGet = function(inst) {
  return async function(url, data, config) {
    data = { params: { ...data } };
    try {
      const res = await inst.get(url, data, config);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  };
};

/**
 * @description 利用Axios实例封装Post请求
 * @param {AxiosInstance} inst
 */
const getMethodPost = function(inst) {
  return async function(url, data, config) {
    data = requestTransform(data); // 添加request格式化方法
    try {
      const res = await inst.post(url, data, config);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  };
};
/**
 * @description 利用Axios实例封装Dlete请求
 * @param {AxiosInstance} inst
 */
const getMethodDelete = function(inst) {
  return async function(url, data, config) {
    data = { params: { ...data } };
    try {
      const res = await inst.delete(url, data, config);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  };
};

/**
 * @description 根据传递过来的urlbase生成对应的axios实例
 * @param {String} urlbase
 */
const getInstance = function(urlbase) {
  const instance = axios.create({
    baseURL: urlbase,
    withCredentials: true,
    headers: HEADERS
  });
  instance.interceptors.request.use(requestInterceptor, requestInterceptorError);
  instance.interceptors.response.use(responseInterceptor, responseInterceptorError);
  return instance;
};

/**
 * @description 工厂方法用于根据不同的urlbase生成不同的服务端接口服务
 * @param {String} urlbase
 */
export const getServer = function(urlbase) {
  const instance = getInstance(urlbase); // 获取实例
  const server = {
    get: getMethodGet(instance),
    post: getMethodPost(instance),
    delete: getMethodDelete(instance)
  };
  return server;
};