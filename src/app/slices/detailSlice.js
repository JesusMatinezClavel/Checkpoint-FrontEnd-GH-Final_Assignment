import { createSlice } from "@reduxjs/toolkit";

export const detailSlice = createSlice({
    name: 'details',
    initialState: {
        userId: "",
        userName: ""
    },
    reducers: {
        addUser: (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        },
        removeUser: (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
})

export const { addUser, removeUser } = detailSlice.actions

export const detailData = (state) => state.details

export default detailSlice.reducer