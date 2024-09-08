import axios from 'axios'

const request = axios.create({
    baseURL: 'https://api.coss.io',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

export default request
