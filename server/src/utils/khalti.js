import axios from 'axios'

const khaltiApi = axios.create({
  baseURL: process.env.KHALTI_GATEWAY_URL,
  headers: {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
})

export default khaltiApi