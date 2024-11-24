import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    status: false,
    role:""
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload,
            state.status = true,
            state.role = action.payload.role
        },
        logout: (state) => {
                state.currentUser = null,
                state.status = false,
                state.role = ""
        }
    }
})
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;