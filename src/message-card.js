import { memo, useState } from "react"
import { toLocalTime } from "./utils/datetime"

import { TimedMessageModal } from "../modals/info-modal"



/**
 * displays the message or media depending if user is the sender
 * 
 * @param message: str - message to be displayed
 * @param datetime: str - datetime when the message was sent
 */

const ChatCard = memo(({currentUserId=null, props}) => {

    
    const {id, message, user, } = props
    
    const {id: userid, name, avatar_url} = user

    const [timedMessageModal, setTimedMessageModal] = useState("")
    
    
    return ( 
        // the == is used instead of === because one is a string and other is an integer
        <div className={`chat-card ${currentUserId == userid? "right-end" : "left-end"}`}> 


            {
                timedMessageModal ?
                <TimedMessageModal message={timedMessageModal} onTimeOut={() => setTimedMessageModal("")}/>
                :
                null
            }

        

            <div className="row center" style={{gap: "5px"}}>

                {currentUserId == userid ?

                    <>  

                        
                        { message ?
                            <div className={`message-body ${currentUserId == userid ? "sender right-end" : "receiver left-end"}`}>
                                {linkify(message)}  
                            </div>
                            :
                            null
                        } 

                        <Link to={`/loner/${name}/`}>
                            <img className="user-icon" src={avatar_url} alt="" />
                        </Link>
                        
                    </>

                    :
                    <>
                        <Link to={`/loner/${name}/`}>
                            <img className="user-icon" src={avatar_url} alt="" />
                        </Link>
                        {
                            message ?
                            <div className={`message-body ${currentUserId == userid ? "sender right-end" : "receiver left-end"}`}>
                                {linkify(message)}  
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
                    <div className="margin-10px" />
                    <div className="right-end username-time">
                        {name}
                    </div>

                </div>
            </div>

        </div>
    )

})


export default ChatCard