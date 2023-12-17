import React, { useEffect, useState } from 'react'
import {Card, Form, Button, Nav} from "react-bootstrap"
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { registerUser } from '../../actions/UserAction'
import "./style.css"


const Register = () => {
    const {error, userMessage, loading} = useSelector(state => state.userStore);

    const [user, setUser] = useState({
        name:"", userName:"", image:"", password:""
    })
    const [pass2, setPass2] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate()

    let name, value;
    const handleInputs =(e) =>{
        name = e.target.name;
        value = e.target.value;
        setUser({...user, [name]:value})
    }

    const handleImage = (e)=>{
        const Reader = new FileReader();
        const file = e.target.files[0];
        Reader.readAsDataURL(file);

        Reader.onload = () =>{
            if(Reader.readyState === 2){
                setUser({...user, ["image"]:(Reader.result)});
            }
            // console.log(user.image);
        }
    }

    const handleRegister =(e) =>{
        e.preventDefault();
        if(pass2 !== user.password){
            alert("Passwords doesn't match...!");
            return;
        }
        dispatch(registerUser(user.name, user.userName, user.image, user.password));
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
            navigate("/");
        }
    },[error, userMessage])

  return(
    <Card className='register'>
        <div className="heading">
            <span className="b">Regi</span><span className="g">ster </span><span className="y">Your</span><span className="r">self</span>
        </div>

        <Form className='reg-form'
        onSubmit={handleRegister}>

            <Form.Group className="mb-3">
                {
                    user.image ? <img src={user.image}/> : <Form.Label>Attach your profile picture</Form.Label>
                }
                <Form.Control type="file" accept='image/*'
                onChange={handleImage}
                style={{marginTop:".5rem"}}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Control type="text" required placeholder="Enter your name..."
                onChange={handleInputs}
                name="name"
                value={user.name}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Control type="text" required placeholder="Enter your userName..."
                onChange={handleInputs}
                name="userName"
                value={user.userName}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Control type="password" required placeholder="Enter password..."
                onChange={handleInputs}
                name="password"
                value={user.password}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Control type="password" required placeholder="Confirm password..."
                onChange={(e) => setPass2(e.target.value)}/>
            </Form.Group>

            <Button variant="outline-primary" type="submit" disabled={loading}>
                Register
            </Button>
        </Form>
        <Nav.Link as={NavLink} className="gr" to="/login">have an account..? Login now</Nav.Link>
    </Card>
    )
}

export default Register