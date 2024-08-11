import {configureStore} from "@reduxjs/toolkit"
import AuthReducers from "./features/Slice"

export const store = configureStore({
    reducer : {
        auth: AuthReducers,
    }
});

