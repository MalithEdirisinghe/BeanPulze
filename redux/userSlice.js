import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: '',
    email: '',
    uid: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.uid = action.payload.uid || '';
        },
        updateUsername: (state, action) => {
            state.username = action.payload;
        },
    },
});

export const { setUser, updateUsername } = userSlice.actions;

export default userSlice.reducer;
