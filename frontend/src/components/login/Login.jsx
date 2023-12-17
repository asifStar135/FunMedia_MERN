import React, { useEffect, useState } from 'react'
import "./style.css"
import { Card, Nav, Form, Button } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux"
import { userLogin } from '../../actions/UserAction'


const Login = () => {
    const {error, userMessage, loading} = useSelector(state => state.userStore);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) =>{
        e.preventDefault();
        await dispatch(userLogin(userName, password));
        // window.location.reload();
        navigate("/");
    }

    useEffect(() =>{
        if(error){
            alert(error);
            dispatch({
                type:"clearErrors"
            })
        }
        if(userMessage){
            alert(userMessage);
            dispatch({
                type:"clearMessages"
            })
        }
    },[error, userMessage])

  return (
    <Card className='login'>
        <div className="heading">
            <span className="g">Log </span><span className="r">in </span><span className="y">Now !</span>
        </div>

        <Form className='login-form' onSubmit={handleLogin}>
            <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Enter userName..." required
                onChange={(e) =>setUserName(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type="password" placeholder="Enter password..." required
                onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>
            <Button variant="outline-primary" type="submit" disabled={loading}>
                LogIn
            </Button>
        </Form>
        <Nav.Link as={NavLink} className="gr" to="/register">dont't have account..? Register now</Nav.Link>
    </Card>
  )
}

export default Login