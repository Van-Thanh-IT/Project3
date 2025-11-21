// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import permissionReducer from "./features/permissionSlice";
import staffReducer from "./features/staffSlice";
import userReducer from "./features/userSlice";
import  sellerReducer from "./features/sellerSlice";
import categoryReducer from "./features/categorySlice";
const store = configureStore({
  reducer: {
    permission: permissionReducer,
    staff: staffReducer,
    user: userReducer,
    seller: sellerReducer,
    category: categoryReducer
  },
});

export default store;
