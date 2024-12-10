import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: {
        user: null,
        accessToken: null, // Store the access token
        refreshToken: null,
    },
    isLoggedIn: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload,
            state.isLoggedIn = true
        },
        logout: (state) => {
                state.currentUser = null,
                state.isLoggedIn = false
        },
        updateUserDetails:(state,action)=>{
            state.currentUser.user = action.payload
        }
    }
})
export const { login, logout,updateUserDetails } = userSlice.actions;
export default userSlice.reducer;