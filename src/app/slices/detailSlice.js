import { createSlice } from "@reduxjs/toolkit";

export const detailSlice = createSlice({
    name: 'details',
    initialState: {
        userId: "",
        userName: "",
        uploadFile: {}
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
        },
        addUpload: (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        },
        removeUpload: (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
})

export const { addUser, removeUser, addUpload, removeUpload } = detailSlice.actions

export const detailData = (state) => state.details

export default detailSlice.reducer