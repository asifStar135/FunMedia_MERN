import { configureStore } from "@reduxjs/toolkit";
import { postReducer } from "./reducers/PostReducer";
import {allUserReducer, userReducer} from "./reducers/UserReducer"

export const store = configureStore({
    reducer:{
        userStore:userReducer,
        allUserStore:allUserReducer,
        postStore:postReducer
    }
})