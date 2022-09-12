import { useEffect, useRef } from "react"
import useWindowDimensions from "./hooks"
            

/**
 * This text component expands upwards as the user types in the input.
 * Used to take input for chat app.
 * includes all the props available for textarea jsx(html) element
 */
const AutoHeightTextarea = ({  value, onInfo, onSendOnEnter, ...props }) => {
    
    const textareaRef = useRef(null)
    
    const {width} = useWindowDimensions()

    useEffect(() => {

        textareaRef.current.style.height = "0px"
        const scrollHeight = textareaRef.current.scrollHeight
        textareaRef.current.style.height = scrollHeight + "px"

    }, [value])

    const handleEnterEvent = (e) => {

        if (e.key === "Enter"){
            e.preventDefault()
            onSendOnEnter(value)
        }

    }

    const onChange = (e) => {
        
        if (props.onChange)
            props.onChange(e)
    }
 
    return (
        <div className="autoresize-container">

            <div className="row center">

                <textarea
                    className="autoresize"
                    ref={textareaRef}
                    {...props}
                    value={value}
                    id="__auto_resize_text__"
                    // onInput={(e) => {props.onChange(e); console.log("chanegd: ", e.target.value)}}
                    onChange={onChange}
                    onKeyUp={handleEnterEvent}
                />
                
            </div>
        
        </div>
    )
}

export default AutoHeightTextarea