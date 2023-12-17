import axios from "axios"

export const addPost = (image, caption) => async(dispatch) =>{
    try {
        dispatch({
            type:"addPostRequest"
        })

        const {data} = await axios.post("/newPost", {image, caption});

        dispatch({
            type:"addPostSuccess",
            payload:data
        })
    } catch (error) {
        dispatch({
            type:"addPostFailure",
            payload:error.response.data.message
        })
    }
}

export const deletePost =(postId) => async(dispatch) =>{
    try {
        dispatch({
            type:"deletePostRequest"
        })

        const {data} = await axios.delete(`/post/${postId}`);

        dispatch({
            type:"deletePostSuccess",
            payload:data
        })
    } catch (error) {
        dispatch({
            type:"deletePostFailure",
            payload:error.response.data.message
        })
    }
}

export const likePost = (postId) => async(dispatch) =>{
    try {
        dispatch({
            type:"likePostRequest"
        })

        const {data} = await axios.put(`/like/${postId}`);

        dispatch({
            type:"likePostSuccess",
            payload:data
        })
    } catch (error) {
        dispatch({
            type:"likePostFailure",
            payload:error.response.data.message
        })
    }
}

export const savePost = (postId) => async(dispatch) =>{
    try {
        dispatch({
            type:"savePostRequest"
        })

        const {data} = await axios.put(`/save/${postId}`);

        dispatch({
            type:"savePostSuccess",
            payload:data
        })
    } catch (error) {
        dispatch({
            type:"savePostFailure",
            payload:error.response.data.message
        })
    }
}

export const commentOnPost = (postId, comment) => async(dispatch) =>{
    try {
        dispatch({
            type:"commentRequest"
        })

        const {data} = await axios.post(`/comment/${postId}`, {comment});

        dispatch({
            type:"commentSuccess",
            payload:data
        })
    } catch (error) {
        dispatch({
            type:"commentFailure",
            payload:error.response.data.message
        })
    }
}

export const deletComment =(postid, commentid) => async(dispatch) =>{
    try {
        dispatch({
            type:"deleteCommentRequest"
        })

        const {data} = await axios.delete(`/comment/${postid}`, {data:{commentid}});

        dispatch({
            type:"deleteCommentSuccess",
            payload:data
        })
    } catch (error){
        dispatch({
            type:"deleteCommentFailure",
            payload:error.response.data.message
        })
    }
}


export const getAllPosts = () => async(dispatch) =>{
    try {
        dispatch({
            type:"allPostsRequest"
        })

        const {data} = await axios.get("/allPosts");

        dispatch({
            type:"allPostsSuccess",
            payload:data
        })
    } catch(error){
        dispatch({
            type:"allPostsFailure",
            payload:error.response.data.message
        })
    }
}