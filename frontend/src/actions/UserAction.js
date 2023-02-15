import axios from "axios";

export const userLogin = (userName, password) => async (dispatch) =>{
    try {
        dispatch({
            type:"loginRequest"
        })

        const {data} = await axios.post("/account/login", {userName, password});

        dispatch({
            type:"loginSuccess",
            payload:data
        })

    } catch (error) {
        dispatch({
            type:"loginFailure",
            payload:error.response.data.message
        })
    }
}

export const loadUser = ()=> async (dispatch) =>{
    try {
        dispatch({
            type:"loadUserRequest"
        })

        const {data} = await axios.get("/account");

        dispatch({
            type:"loadUserSuccess",
            payload:data
        })
    } catch (error) {
        dispatch({
            type:"loadUserFailure",
            payload:error.response.data.message
        })
    }
}

export const registerUser = (name, userName, image, password) => async(dispatch) =>{
    try {
        dispatch({
            type:"registerRequest"
        })

        const {data} = await axios.post("/account/register", {
            name, userName, image, password
        });

        dispatch({
            type:"registerSuccess",
            payload:data
        })
    }catch(error) {
        dispatch({
            type:"registerFailure",
            payload:error.response.data.message
        })
    }
}

export const updateUser =(name, image, password) => async(dispatch) =>{
    try {
        dispatch({
            type:"updateUserRequest"
        })

        const {data} = await axios.put("/account/update", {name, image, password});

        dispatch({
            type:"updateUserSuccess",
            payload:data
        })
    } catch (error) {
        dispatch({
            type:"updateUserFailure",
            payload:error.response.data.message
        })
    }
}

export const findUser =(userId) => async(dispatch) =>{
    try {
        dispatch({
            type:"findUserRequest"
        })

        const {data} = await axios.get(`/user/${userId}`);

        dispatch({
            type:"findUserSuccess",
            payload:data
        })
    } catch (error) {
        dispatch({
            type:"findUserFailure",
            payload:error.response.data.message
        })
    }
}


export const getAllUsers = () => async(dispatch) =>{
    try {
        dispatch({
            type:"allUserRequest",
        })

        const {data} = await axios.get("/allUsers");
        dispatch({
            type:"allUserSuccess",
            payload:data
        })
    } catch (error) {
        dispatch({
            type:"allUserFailure",
            payload:error.response.data.message
        })
    }
}

export const followUser =(userId) => async(dispatch) =>{
    try {
        dispatch({
            type:"followRequest"
        })

        const {data} = await axios.put(`/user/${userId}`);

        dispatch({
            type:"followSuccess",
            payload:data
        })
    } catch (error){
        dispatch({
            type:"followFailure",
            payload:error.response.data.message
        })
    }
}

export const logOutUser =() => async(dispatch) =>{
    try {
        dispatch({
            type:"logOutRequest"
        })

        const {data} = await axios.put("/account/logout");
        dispatch({
            type:"logOutSuccess",
            payload:data
        })
    } catch (error) {
        dispatch({
            type:"logOutFailure",
            payload:error.response.data.message
        })
    }
}

export const deleteUser =(password) => async(dispatch) =>{
    try {
        dispatch({
            type:"deleteRequest"
        });

        const {data} = await axios.delete("/account", {data:{password}})
        dispatch({
            type:"deleteSuccess",
            payload:data
        })
    } catch (error) {
        dispatch({
            type:"deleteFailure",
            payload:error.response.data.message
        })
    }
}