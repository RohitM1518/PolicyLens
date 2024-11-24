import { createContext } from "react";
import { useContext } from "react";
import { useState } from "react";

const UserContext = createContext()

export const useUserContext = ()=>{
    return useContext(UserContext)
}

export const UserContextProvider=({children})=>{
    const [user, setUser] = useState(null)
    return <UserContext.Provider value={{user,setUser}}>
        {children}
    </UserContext.Provider>
}