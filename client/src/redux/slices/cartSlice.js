import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    items: [],
    totalCount: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialValue,
    reducers: {
        setCartData(state, action) {
            state.items = action.payload;
            state.totalCount = action.payload.length;
        },
        addItem(state, action) {
            let find = state?.items?.findIndex((item) => item._id === action.payload._id)
            if (find >= 0) {
                state.items[find].quantity += 1;
            }
            else {
                state.items.push(action.payload)
            }
            // totalCount evaluate
            state.totalCount = state.items.length;
        },
        removeItem(state, action) {
            let find = state?.items?.findIndex((item) => item._id === action.payload._id)
            if (state.items[find].quantity > 1) {
                state.items[find].quantity -= 1;
            }
            else {
                state.items = state.items.filter(item => item._id !== action.payload._id);
                state.totalCount = state.items.length
            }

        },
        deleteItemFromCart(state, action) {
            state.items = state.items.filter(item => item._id !== action.payload._id);
            state.totalCount = state.items.length
        }
        ,
        clearCart(state) {
            state.items= [],
            state.totalCount = 0
        }
    }
})

export const { setCartData, addItem, removeItem, clearCart, deleteItemFromCart } = cartSlice.actions;
export default cartSlice.reducer;