import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    loading: false,
    currentUser: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true
        },
        loginSuccess: (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.currentUser = action.payload
        },
        loginFail: (state) => {
            state.loading = false
            state.isAuthenticated = false
        }
    }
})
export const { loginStart, loginSuccess, loginFail } = authSlice.actions
export default authSlice.reducer