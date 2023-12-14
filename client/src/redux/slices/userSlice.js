import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    userId : '',
    name: '',
    image: '',
    email: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialValue,
    reducers: {
        setUserData(state, action) {
            state.userId = action.payload._id
            state.name = action.payload.name
            state.image = action.payload.image
            state.email = action.payload.email
        },
    }
})

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;