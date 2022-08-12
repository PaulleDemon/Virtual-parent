import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"


import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


const dontTryErrors = [400, 401, 404, 403, 417]

const queryClientConfig = {

    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (dontTryErrors.includes(error.response?.status) || error.response?.status >= 500) //dont retry if the page returns 404 or 400
                    return false 

                if (failureCount >= 3)
                    return false

                return true
            }
        },

        mutations: {
            retry: (failureCount, error) => {
                
                if (error.response?.status === 401){
                    // clear local storage if the session expires or is unauthorized
                    localStorage.removeItem("user-id")
                    localStorage.removeItem("user-name")
                }

				if (dontTryErrors.includes(error.response?.status) || error.response?.status >= 500) //dont retry if the page returns 404 or 400
				//dont retry if the page returns 404 or 400 or 403 or 401
                    return false 

                if (failureCount >= 3)
                    return false

                return true
            }
        }
    }

}


const queryClient = new QueryClient(queryClientConfig)
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient} >	
			<App />
		</QueryClientProvider>
	</React.StrictMode>
)