import {createReducer} from "@reduxjs/toolkit"

export const postReducer = createReducer({},{
    addPostRequest: (state) =>{
        state.loading = true;
    },
    addPostSuccess: (state, action) =>{
        state.loading = false;
        state.postMessage = action.payload.message;
    },
    addPostFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

    allPostsRequest: (state) =>{
        state.loading = true;
    },
    allPostsSuccess: (state, action) =>{
        state.loading = false;
        state.message = action.payload.message;
        state.allPosts = action.payload.allPosts;
    },
    allPostsFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

    likePostRequest: (state) =>{
        state.loading = true;
    },
    likePostSuccess: (state, action) =>{
        state.loading = false;
        state.message = action.payload.message;
    },
    likePostFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

    savePostRequest: (state) =>{
        state.loading = true;
    },
    savePostSuccess: (state, action) =>{
        state.loading = false;
        state.message = action.payload.message;
    },
    savePostFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

    commentRequest: (state) =>{
        state.loading = true;
    },
    commentSuccess: (state, action) =>{
        state.loading = false;
        state.postMessage = action.payload.message;
    },
    commentFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

    deletePostRequest: (state) =>{
        state.loading = true;
    },
    deletePostSuccess: (state, action) =>{
        state.loading = false;
        state.postMessage = action.payload.message;
    },
    deletePostFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

    deleteCommentRequest: (state) =>{
        state.loading = true;
    },
    deleteCommentSuccess: (state, action) =>{
        state.loading = false;
        state.postMessage = action.payload.message;
    },
    deleteCommentFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },

    clearPostMessages : (state) =>{
        state.message = null;
        state.userMessage = null
    },
    clearPostErrors : (state) =>{
        state.error = null;
    }
})