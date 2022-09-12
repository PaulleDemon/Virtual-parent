import axios from "axios"


export const api = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
})


export const getConfig = () => {

    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    }
   
    return config

}


export const sendText = (text) => {

    const body = JSON.stringify(text)

    return api.post(`/parent/talk/`, body, getConfig())

}


export const trainData = () => {

    return api.get(`/parent/train/`, getConfig())
}