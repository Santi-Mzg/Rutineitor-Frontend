import axios from './axios'

export const subscribeRequest = (userId, subscription) => axios.post(`/webpush/subscribe`, { userId, subscription })

export const unsubscribeRequest = (endpoint) => axios.post(`/webpush/unsubscribe`, { endpoint })

export const sendWebPushRequest = (endpoint, pushBody) => axios.post(`/webpush/send`, { endpoint, pushBody })
