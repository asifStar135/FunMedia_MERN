import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Nav } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useSearchParams } from 'react-router-dom'
import { updateUser } from '../../actions/UserAction'
import "./style.css"

const Update = () => {
    const {error, message} = useSelector(state => state.userStore);
    let name, value;

    const dispatch = useDispatch();
    const [user, setUser] = useState({
        name:"", image:"", password:""
    });
    const [pass2, setPass2] = useState();

    const handleInput = (e) =>{
        name = e.target.name;
        value = e.target.value;
        setUser({...user, [name]:value});
    }

    const handleImage =(e) =>{
        const Reader = new FileReader();
        const file = e.target.files[0];

        Reader.readAsDataURL(file);
        Reader.onload = () =>{
            if(Reader.readyState === 2){
                setUser({...user, ["image"]:Reader.result});
            }
        }
    }

    const handleUpdate =(e) =>{
        e.preventDefault();
        if(!user.name && !user.image && !user.password){
            alert("No details to update...!");
            return;
        }
        if(user.password && user.password !== pass2){
            alert("Passwords doesn't match...!");
            return;
        }

        dispatch(updateUser(user.name, user.image, user.password));
    }

    useEffect(() =>{
        if(error) alert(error);
        if(message) alert(message);
    },[error, message])

  return (
    <Card className='update'>
        <div className="heading">
            <span className="y">Upd</span><span className="r">ate </span><span className="g">Pro</span><span className="b">file</span>
        </div>
        <Form className='update-form'
        onSubmit={handleUpdate}>
            <Form.Group controlId="formFile" className="mb-3">
                    {
                        user.image ? <img src={user.image}/> : <Form.Label>Select new profile picture !</Form.Label>
                    }
                <Form.Control type="file" accept='image/*'
                onChange={handleImage}
                style={{marginTop:".5rem"}}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Enter your name..."
                name="name" value={user.name}
                onChange={handleInput}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type="password" placeholder="Enter new password..."
                name="password" value={user.password}
                onChange={handleInput}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type="password" placeholder="Confirm new password..."
                onChange={(e) => setPass2(e.target.value)}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Save Changes
            </Button>
        </Form>
        <Nav.Link as={NavLink} className="gr" to="/account">go back to account</Nav.Link>
    </Card>
  )
}

export default Update