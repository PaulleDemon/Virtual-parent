import React, {useEffect, useMemo, useRef, useState} from "react"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query"

import {ReactComponent as SEND} from "../icons/send.svg"

import ChatCard from "../components/message-card"
import AutoHeightTextarea from "../components/auto-resize-textarea"

import { TimedMessageModal  } from "./modal"
import { randInt } from "../utils/random-generator"

import { getMessages, getMafia, uploadChatMedia } from "../apis/loner-apis"
import { LoadingWheel } from "./loading"

// import { useTitle } from "../utils/hooks"


const docElementStyle = document.documentElement.style


/**
 * Displays chat header
 * @param onMafiaUpdate: function - function to be executed when the mafia info is updated
 * @param props - contains name, icon, about, tag_line and rules: Array
 * 
 */
function ChatHeader({name, props}){

    const [timedMesage, setTimedMessage] = useState("")

    return (
        <div className="chat-header">

            {
                timedMesage !== ""?
                <TimedMessageModal message={timedMesage} timeout={2000} onTimeOut={() => setTimedMessage("")}/>
                :
                null
            }
      
            <div className="row center margin-10px">
                <div className="info column margin-10px">
                    <div className="mafia-name">
                        {name}
                    </div>
                </div>
            </div>

        </div>
    )

}

// random texts to be filled for first time users.
const randomTexts = [
    "Hello"
]

/**
 * Makes websocket connection and handles incoming and outgoing messages
 */
export default function Chat(){
    // useTitle(mafia, [mafia])

    const mediaRef = useRef()
    const queryClient = useQueryClient()

    const [text, setText] = useState("")
    
    const [timedMesage, setTimedMessage] = useState("")
    const [queryEnabled, setQueryEnabled] = useState(false)

    const [mafiaDetails, setMafiaDetails] =useState({
                                            id: null,
                                            name: "",
                                            icon: "",
                                            rules: [],
                                            mods: [],
                                            is_mod: false,
                                            is_staff: false
                                            })

    const [messages, setMessages] = useState([])


    const [scrollToEnd, setScrollToEnd] = useState(true)
    const scrollRef = useRef() // refernce to chat body
    const lastMessageRef = useRef() //reference to the last message div

    
    const chatQuery = useInfiniteQuery(["chat"], getMessages, {
        enabled: queryEnabled,
        getNextPageParam: (lastPage, ) => {
         
            if (lastPage.data.current < lastPage.data.pages){
                return lastPage.data.current + 1}
            
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        onError: (err) => {
            
            if (err.response?.status === 404){
                setQueryEnabled(false)
                // setShow404Page(true)
            }
        },

    })

    const uploadMediaMessageMutation = useMutation(uploadChatMedia, {
        onSuccess: () => {
       
            setText("")
        },
        onError: () => {
            setTimedMessage("An error occurred. Try again later.")
        }
    })

    useEffect(() => {
        // update the title
        document.title = `Virtual parent`

        return () => {
            document.title = `LonersMafia`
        }
    }, [])

    useEffect(() => {

        const chatPages = []

        console.log("Chat qyery: ", chatQuery.status, chatQuery.data)
        if (chatQuery.status === "success"){
            chatQuery.data.pages?.forEach((x) => {
                x.data.results?.forEach( (x) =>{
                    chatPages.push(x)
                }
                )      
            })
            
            /* NOTE: 
            The below commented line removes the duplicate just incase and displays it in the latest order.
            The duplicate value arises because when there is a new message through websocket, we are not
            fetching the same page again(because we don't need to). 
            For example: page1 contains ids: {58, 57, 56} and page 2 has: {55, 54, 53}
            Now a new message is added through websocket. So
            The page1 has ids {59, 58, 57} and page2: has {56, 55, 54} but the 56 was already there in the 
            messages which leads to data duplication and makes it unusable as key for list elements.
            */
            const chat_pages = [...chatPages.reverse(), ...messages].filter((value, index, a) =>
            index === a.findIndex((t) => (t.id === value.id))
            )

            setMessages(chat_pages)
            // console.log("Messages: ", chat_pages)
            
        }
    }, [chatQuery.status, chatQuery.data, chatQuery.isFetched])
    
    useEffect(() => {

        if (!localStorage.getItem("sent-first-message")){
            setText(randomTexts[randInt(0, randomTexts.length-1)])
        }

    }, [])

    useEffect(() => {
        // when there is a new message scroll to the bottom if the scrollbar is already at bottom
        // console.log("scroll to bottom")
        if (scrollToEnd)
            scrollToBottom()

    }, [messages])
    
    useEffect(() => {

        if (!window.navigator.onLine){
            setTimedMessage("You are not connected to internet")
        }

    }, [window.navigator.onLine])

    const currentUserId = useMemo(() => localStorage.getItem("user-id"), [localStorage.getItem("user-id")])
    
    const user_is_mod = useMemo(() => {
        return JSON.parse(sessionStorage.getItem("is_mod"))
    }, [sessionStorage.getItem("is_mod")])

    const user_is_staff = useMemo(() => {
        return JSON.parse(sessionStorage.getItem("is_staff"))
    }, [sessionStorage.getItem("is_staff")])


    const sumbitMessage = () => {

        if (!navigator.onLine && process.env.NODE_ENV === "production"){
            setTimedMessage("You are offline :(")
            return 
        }

        else{

            if (!text.trim())
                return
            
            // TODO: SEND THE MESSAGE
            ({
                "message": text.trim()
            })

            setText("")
        }

    }

    const scrollToBottom = () => {

        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            
    }

    const handleChatScroll = (e) =>{
        const bottom = e.target.scrollHeight - e.target.scrollTop <= (e.target.clientHeight + 50)
  
        if (!bottom && scrollToEnd){
            setScrollToEnd(false)
        }

        else if(!scrollToEnd && bottom){
            setScrollToEnd(true)
        }

        // console.log("Target: ", e.target.scrollTop, chatQuery.status)
        if (e.target.scrollTop < 40 && (chatQuery.status === "loading" || chatQuery.isFetching)){ // prevent completely from scrolling top top when loading
            e.target.scrollTop = 40
        }

        // If the scroll-bar is at the top then fetch old messages from the database
        // note: we may also have to check if scroll bar is scrolling to the top
        if (scrollRef.current && (100 >= scrollRef.current.scrollTop 
            || scrollRef.current.clientHeight === scrollRef.current.scrollHeight) 
            && (chatQuery.hasNextPage === undefined || chatQuery.hasNextPage === true)) {
           
                chatQuery.fetchNextPage({cancelRefetch: false})
        }        
    }

    const onBanSuccess = (userid) => {
        
        queryClient.setQueryData(["chat", mafiaDetails.id], (data) => {
            console.log("deleted data1: ", data)
            
            // updates all the cache and sets banned to true
            const newPagesArray = data.pages.map((data) =>{
                                // find and update the specific data
                                // console.log("deleted data: ", data.data.results)
                                data.data.results.map((result, index) => {
                                    console.log("Banned: ",  result.user.id, currentUserId)
                                    if (result?.user?.id == userid){ // update all cache where userid= user and mafia id= mafiaid
                                        data.data.results[index].is_banned = true
                                        console.log("Banned2: ", data.data.results[index])
                                    }
                                    return result
                                })
                                    

                                return data
                                }) 
                
            return {
                pages: newPagesArray,
                pageParams: data.pageParams
            }
        })

    }

    return (
        <div className="chat-page">

            <ChatHeader onMaifaUpdate={() => {}} 
                            props={mafiaDetails}/>

            {
                timedMesage !== ""?
                    <TimedMessageModal message={timedMesage} timeout={2000} onTimeOut={() => setTimedMessage("")}/>
                :
                    null
            }
            <div className="chat-body" ref={scrollRef} onScroll={handleChatScroll}>

                {
                    (navigator.onLine && (chatQuery.isLoading || chatQuery.isFetching)) ? 
                        <LoadingWheel />
                        :
                    null
                }

                {
                    (!navigator.onLine) ? 

                        <div className="row center">
                            you are not connected to the internet
                        </div>
                    :
                    null
                }

                {
                    messages.map((msg) => {
                
                        return (<li key={msg.id}>
                                    <ChatCard 
                                        currentUserId={currentUserId}
                                        user_is_mod={user_is_mod}
                                        user_is_staff={user_is_staff}
                                        onBanSuccess={onBanSuccess}
                                        props={msg}/>
                                </li>)  
                    })
                }
            </div>

            <div ref={lastMessageRef}/>
            

            <div className="message-container">
                
                <AutoHeightTextarea 
                    value={text}
                    maxLength={1000} 
                    mediaRef={mediaRef}
                    onChange={e => {setText(e.target.value)}}
                    onInfo={(info) => setTimedMessage(info)}
                    disabled={uploadMediaMessageMutation.isLoading}
                    onSendOnEnter={sumbitMessage}
                />
            
                <button className="send-btn" onClick={sumbitMessage}> 
                    <SEND fill="#fff"/>
                </button>
            
            </div>

        </div>
    )

}