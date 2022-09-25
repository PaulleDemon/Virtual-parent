import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import AutoHeightTextarea from "./auto-resize-textarea"
import ChatCard from "./message-card"
import { sendText, trainData } from "./apis/apis"
import { useRef } from "react"
import { useEffect } from "react"


const ChatPage = () => {

    const endRef = useRef()

    const chatMutate = useMutation(sendText, {
        enabled: false,
        onSuccess: (data) => {

    
        },
        onError: (err) => {
            console.log("error: ", err.response)
        } 
    })

    const trainDataQuery = useQuery(['train'], trainData, {
        enabled: false,
        onSuccess: () => {
            console.log("Success")
            
        }
    })

    const [messages, setMessages] = useState([
                                            {   
                                                virtual: true,
                                                message: "Hello, I am your virtual parent, Sara. Enter your name to get started"
                                            }
                                            ])

    const [userMessage, setUserMessage] = useState("")

    useEffect(() => {

        if (chatMutate.data && chatMutate.isSuccess){
            const newMessage = {
                virtual: true,
                message: chatMutate.data.data?.message
            }

            setMessages([
                ...messages,
                {
                    virtual: false,
                    message: userMessage
                },
                newMessage
            ])
            setUserMessage("")
            setTimeout(() => endRef.current.scrollIntoView(), 2)

        }

      
    }, [chatMutate.data])

    const handleSendMessage = () => {

        if (userMessage.trim().length === 0){
            return
        }

        const newMessage = {
            virtual: false,
            message: userMessage
        }

        chatMutate.mutate({text: newMessage.message})

    }

    return (
        <div className="chat-page">
            <div className="chat-header center">
                <div>Virtual parent VP</div>
            
                <div className="btn margin-10px right-end" 
                     onClick={() => {trainDataQuery.refetch()}}
                    >
                    train data
                </div>
            </div>

            <div className="chat-body">
                {
                    messages.map((message, index) => {
                        return (
                            <ChatCard key={index} message={message.message} is_sender={!message.virtual}/>
                        )
                    })
                }
                <div ref={endRef} className="margin-10px"/>
            </div>
            

            <div className="message-container">
                <AutoHeightTextarea 
                maxLength={100}
                value={userMessage} 
                onSendOnEnter={(val) => {setUserMessage(val); handleSendMessage()}}
                onChange={(e) => setUserMessage(e.target.value)}/>
                <div className="btn" onClick={handleSendMessage}>send</div>
            </div>
        </div>
    )

}


export default ChatPage