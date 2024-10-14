import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true
        },
        loginSuccess: (state) => {
            state.loading = false
        },
        loginFail: (state) => {
            state.loading = false
        },
        logout: (state) => {
        }
    }
})
export const { loginStart, loginSuccess, loginFail, logout
} = authSlice.actions
export default authSlice.reducer