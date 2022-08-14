import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import AutoHeightTextarea from "./auto-resize-textarea"


const ChatPage = () => {

    const chatQuery = useQuery(['chat'] )

    const [userMessage, setUserMessage] = useState("cool")

    return (
        <div className="chat-page">
            <div className="chat-header">
                Virtual parent VP
            </div>

            <div className="chat-body">

            </div>
            <AutoHeightTextarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)}/>
        </div>
    )

}


export default ChatPage