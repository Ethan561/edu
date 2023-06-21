/*
 * @Author: liuyi
 * @Date: 2022-05-18 23:52:20
 * @LastEditors: liuyi
 * @LastEditTime: 2023-06-12 15:35:41
 * @FilePath: \questionnaire-pc\src\http\interface.js
 * @Description: 
 */
import req from './api.js';
import { Session } from '@/utils/common';
import { apiTokenKey } from "@/config";

/* get请求示例 */
export const HTTP_CptCheck = (device_uuid, code) => req('/api/cpt/check', {
  device_uuid,
  code
}, { method: 'GET', loading: { show: false } })
/* 用户登录 */
export const HTTP_UserLogin = (username, password, code, device_uuid) => req('/api/users/login', {
  username,
  password,
  code,
  device_uuid
}, { method: 'POST', loading: { show: false } })

/* 首页信息 */
export const HTTP_Index = (api_token = Session.get(apiTokenKey)) => req('/api/index/index', {
  api_token
}, { method: 'GET', loading: { show: false } })

/* 题目信息 */
export const HTTP_Accurate = (qid, api_token = Session.get(apiTokenKey)) => req('/api/index/accurate', {
  api_token,
  qid
}, { method: 'GET', loading: { show: true } })

/* 精准提交 */
export const HTTP_AccurateSave = (start_time,id, write, action, api_token = Session.get(apiTokenKey)) => req('/api/index/save', {
  start_time,
  api_token,
  id,
  write,
  action
}, { method: 'POST', loading: { show: false } })

export const HTTP_AccurateSaveAll = (start_time,id, write, action, api_token = Session.get(apiTokenKey)) => req('/api/index/save', {
  start_time,
  api_token,
  id,
  write,
  action
}, { method: 'POST', loading: { show: true } })

/* 开放问卷 */
export const HTTP_AccurateOpen = (qid) => req('/api/index/open', {
  qid
}, { method: 'GET', loading: { show: false } })
/* 精准提交 */
export const HTTP_AccurateOpenSave = (start_time, id, write) => req('/api/index/opensave', {
  start_time,
  id,
  write
}, { method: 'POST', loading: { show: false } })

/* 用户信息 */
export const HTTP_Userinfo = (api_token = Session.get(apiTokenKey)) => req('/api/users/info', {
  api_token
}, { method: 'GET', loading: { show: false } })

/* 退出登录 */

export const HTTP_Logout = (api_token = Session.get(apiTokenKey)) => req('/api/users/logout', {
  api_token
}, { method: 'GET', loading: { show: false } })

/* 文件上传 */

export const HTTP_Uploads = (file, type, api_token = Session.get(apiTokenKey)) => req('/api/users/uploads', {
  file,
  type,
  api_token
}, { method: 'post', loading: { show: true },useUpload: true })