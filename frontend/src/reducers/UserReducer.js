import {createReducer} from "@reduxjs/toolkit"

const intialState = {
    isAuthenticated : false
}

export const userReducer = createReducer(intialState, {
    loadUserRequest: (state) =>{
        state.loading = true;
    },
    loadUserSuccess: (state, action) =>{
        state.loading = false;
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.isAuthenticated = true;
    },
    loadUserFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

    loginRequest: (state) =>{
        state.loading = true;
    },
    loginSuccess: (state, action) =>{
        state.loading = false;
        state.userMessage = action.payload.message;
        state.user = action.payload.user;
        state.isAuthenticated = true;
    },
    loginFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

    registerRequest: (state) =>{
        state.loading = true;
    },
    registerSuccess: (state, action) =>{
        state.loading = false;
        state.userMessage = action.payload.message;
        state.user = action.payload.user;
        state.isAuthenticated = true;
    },
    registerFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

    updateUserRequest : (state) =>{
        state.loading = true;
    },
    updateUserSuccess : (state, action) =>{
        state.loading = false;
        state.userMessage = action.payload.message;
    },
    updateUserFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

    findUserRequest : (state) =>{
        state.loading = true;
    },
    findUserSuccess : (state, action) =>{
        state.loading = false;
        state.message = action.payload.message;
        state.foundUser = action.payload.foundUser;
    },
    findUserFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },   

    followRequest : (state) =>{
        state.loading = true;
    },
    followSuccess : (state, action) =>{
        state.loading = false;
        state.message = action.payload.message;
    },
    followFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    }, 

    logOutRequest : (state) =>{
        state.loading = true;
    },
    logOutSuccess : (state, action) =>{
        state.loading = false;
        state.userMessage = action.payload.message;
        state.isAuthenticated = false;
    },
    logOutFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    }, 

    deleteRequest : (state) =>{
        state.loading = true;
    },
    deleteSuccess : (state, action) =>{
        state.loading = false;
        state.userMessage = action.payload.message;
        state.isAuthenticated = false;
    },
    deleteFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    }, 

    clearMessages : (state) =>{
        state.message = null;
        state.userMessage = null
    },
    clearErrors : (state) =>{
        state.error = null;
    }
})

export const allUserReducer = createReducer({},{
    allUserRequest : (state) =>{
        state.loading = true;
    },
    allUserSuccess : (state, action) =>{
        state.loading = false;
        state.allUsers = action.payload.allUsers;
        state.message = action.payload.message;
    },
    allUserFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

})