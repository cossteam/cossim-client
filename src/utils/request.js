import axios from 'axios'

const request = axios.create({
  baseURL: ,
  timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
//   },
})

request.interceptors.request.use(
  config => {
    // Do something before request is sent
    // console.log(config)
    return config
  },
  error => {
    // Do something with request error
    console.log(error) 
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.log(error) 
    return Promise.reject(error)
  }
)