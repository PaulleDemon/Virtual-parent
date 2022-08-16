import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import AutoHeightTextarea from "./auto-resize-textarea"
import ChatCard from "./message-card"


const ChatPage = () => {

    const chatQuery = useQuery(['chat'] )

    const [messages, setMessages] = useState([
                                            {   
                                                virtual: true,
                                                message: "Hello, I am your virtual parent, Sara. Enter your name to get started"
                                            }
                                            ])

    const [userMessage, setUserMessage] = useState("cool")

    const handleSendMessage = () => {

        if (userMessage.trim().length === 0){
            return
        }

        const newMessage = {
            virtual: false,
            message: userMessage
        }

        setMessages([
            ...messages,
            newMessage
        ])

        setUserMessage("")

    }

    return (
        <div className="chat-page">
            <div className="chat-header center">
                Virtual parent VP
            </div>

            <div className="chat-body">
                {
                    messages.map((message, index) => {
                        return (
                            <ChatCard key={index} message={message.message} is_sender={!message.virtual}/>
                        )
                    })
                }
            </div>

            <div className="message-container">
                <AutoHeightTextarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)}/>
                <div className="btn" onClick={handleSendMessage}>send</div>
            </div>
        </div>
    )

}


export default ChatPage