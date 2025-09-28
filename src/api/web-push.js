import axios from './axios'

export const subscribeRequest = (id, subscription) => axios.post(`/webpush/subscribe`, { id, subscription })

export const unsubscribeRequest = (endpoint) => axios.post(`/webpush/unsubscribe`, { endpoint })

export const sendWebPushRequest = (endpoint, pushBody) => axios.post(`/webpush/send`, { endpoint, pushBody })
