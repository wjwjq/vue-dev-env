import axios from "axios";
import store from "store/";
import {
  AUTH_FAIL,
  SIGN_OUT
} from "store/user/constant";

import qs from "qs";

import {
  request
} from "http";
import {
  error
} from "util";

const instance = axios.create();

Promise.stop = () => new Promise(() => {});


const dateFormat = date => {
  if (!date) {
    throw new Error(`argument 'date' is required`);
  }
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  let fmt = "yyyy-MM-dd hh:mm:ss";
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

const globalAxiosErrorHandler = errResponse => {
  const host = window.location.origin;
  const {
    timestamp,
    status,
    error,
    path,
    method
  } = errResponse;
  console.error(`${dateFormat(timestamp)}  ${method.toUpperCase()}: ${host}${path}  ${status} (${error})`);
};

async function networkCall(axiosPromise) {
  let resData = null;
  try {
    const response = await axiosPromise;
    resData = await response.data;
    const code = await resData.code;
    if (+code === 0) { //请求成功
      return await resData.data;
    } else if (+code === 403) { //验证失败
      store.dispatch({
        type: AUTH_FAIL
      });
      return Promise.stop();
    } else { //请求失败
      return Promise.reject({
        code,
        reason: resData.reason
      });
    }
  } catch (error) { //请求异常  status !== 200
    globalAxiosErrorHandler(Object.assign({}, error.response.data, {
      method: error.config.method
    }));
    return Promise.stop();
  }
}

const get = (url, params) => networkCall(instance(url, {
  withCredentials: "include",
  params
}));


const post = (url, postData) => networkCall(instance(url, {
  method: "POST",
  withCredentials: "include",
  // headers: {
  //   'Content-type': 'application/json;charset=UTF-8'
  // },
  data: qs.stringify(postData)
  // data: JSON.stringify(postData)
}));

const put = (url, postData) => networkCall(instance(url, {
  method: "PUT",
  withCredentials: "include",
  // headers: {
  //     'Content-type': 'application/json;charset=UTF-8'
  // },
  data: qs.stringify(postData)
}));

const del = (url, postData) => networkCall(instance(url, {
  method: "DELETE",
  withCredentials: "include",
  data: postData
}));

const dealAll = requestArrayList => {};

async function all(requestArrayList) {
  console.info("requestArrayList", requestArrayList);
  let result = [];
  let r;
  try {
    await requestArrayList.map(requestPromise => requestPromise.then(resData => result.push(resData)).catch(error => console.info(error)));
    console.info(result);
  } catch (error) {
    console.info("axios all error", error);
  }
}

export default {
  delete: del,
  get,
  post,
  put,
  all
};