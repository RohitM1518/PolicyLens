import {createContext, useContext, useState } from "react";


const ResponseContext = createContext();

export const useResponseContext=()=>{
    return useContext(ResponseContext);
}

export const ResponseContextProvider=({children})=>{
    const [response,setResponse]=useState('');
    return (<ResponseContext.Provider value={{response,setResponse}}>
        {children}
    </ResponseContext.Provider>
    )
}