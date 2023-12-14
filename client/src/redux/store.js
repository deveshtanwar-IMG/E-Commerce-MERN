import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";

const Store = configureStore({
    reducer:{
        cart: cartSlice,
        user: userSlice
    }
})

export default Store;