import axios from 'axios'

export const dashDriverInstance = axios.create({
  baseURL: 'http://192.168.0.111:3000',
})
