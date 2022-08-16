import { memo, useState } from "react"
import { toLocalTime } from "./utils/datetime"

import { TimedMessageModal } from "./info-modal"



/**
 * displays the message or media depending if user is the sender
 * 
 * @param message: str - message to be displayed
 * @param datetime: str - datetime when the message was sent
 */

const ChatCard = memo(({message, datetime=new Date(), is_sender=false}) => {


    const [timedMessageModal, setTimedMessageModal] = useState("")
    
    
    return ( 
        // the == is used instead of === because one is a string and other is an integer
        <div className={`chat-card ${is_sender? "right-end" : "left-end"}`}> 


            {
                timedMessageModal ?
                <TimedMessageModal message={timedMessageModal} onTimeOut={() => setTimedMessageModal("")}/>
                :
                null
            }

        

            <div className="row center" style={{gap: "5px"}}>

                {is_sender ?

                    <>  

                        
                        { message ?
                            <div className={`message-body ${is_sender ? "sender right-end" : "receiver left-end"}`}>
                                {message}  
                            </div>
                            :
                            null
                        } 

    
                        
                    </>

                    :
                    <>
                        
                        {
                            message ?
                            <div className={`message-body ${is_sender ? "sender right-end" : "receiver left-end"}`}>
                                {message}  
                            </div>
                            :
                            null
                        }      


                    </>
                }
                
            </div>
        
            <div className="column">
                <div className="row">

                    <div className="left-end username-time">
                        {toLocalTime(datetime)}
                    </div>

                </div>
            </div>

        </div>
    )

})


export default ChatCard