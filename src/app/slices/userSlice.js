import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        credentials: {}
    },
    reducers: {
        login: (state, action) => {
            return {
                ...state,
                credentials: action.payload
            }
        },
        logout: (state, action) => {
            return {
                ...state,
                credentials: {}
            }
        }
    }
})

export const { login, logout } = userSlice.actions

export const userData = (state) => state.user

export default userSlice.reducer