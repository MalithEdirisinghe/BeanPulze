import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: '',
    email: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
        },
        updateUsername: (state, action) => {
            state.username = action.payload;
        },
    },
});

export const { setUser, updateUsername } = userSlice.actions;

export default userSlice.reducer;
