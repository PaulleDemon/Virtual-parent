
import { memo, useEffect } from "react"



/**
 * @param message: str - message to be displayed
 * @param onTimedOut: function - function to execute when the timer stops
 * @param timeout: number - seconds to countdown
 */

 export const TimedMessageModal = memo(({message, onTimeOut, timeout=2000}) => {

    useEffect(() => {

        setTimeout(() => onTimeOut(), timeout)

    }, [])

    return (
    
        <div className="timed-modal row center">
            {message}
        </div>
            
        
    )
} 
)
