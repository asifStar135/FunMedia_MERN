import React, { useEffect, useState } from 'react'
import "./style.css"
import { Card, Form, InputGroup, Button } from 'react-bootstrap'
import User from '../user/User'
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../../actions/PostActions';

const NewPost = () => {
    const [image, setImage] = useState("");
    const [caption, setCaption] = useState("");
    const {user} = useSelector(state => state.userStore);
    const {loading, postMessage} = useSelector(state => state.postStore);

    const dispatch = useDispatch();

    const handleImage = (e)=>{
        const Reader = new FileReader();
        const file = e.target.files[0];
        Reader.readAsDataURL(file);

        Reader.onload = () =>{
            if(Reader.readyState === 2){
                setImage(Reader.result);
            }
        }
    }

    const handlePost = (e) =>{
        e.preventDefault();
        
        dispatch(addPost(image, caption));
    }

    useEffect(() =>{
        if(postMessage){
            alert(postMessage);

            dispatch({
                type:"clearPostMessages"
            })
            // window.location.reload();
        }
    },[postMessage, dispatch])
    return (
        <>
            <Card className='addPost'> 
                <div className="heading">
                    <span className='g'>Add </span><span className='b'>Your </span><span className='y'>New </span><span className='r'>Post</span>
                </div>
                <User image={user.image.url}
                userName={user.userName}
                id={user._id}/>

                <Form 
                onSubmit={handlePost}
                >
                    <Form.Group controlId="formFile" className="mb-3">
                    {
                        image ? <img className='form-img shadow' src={image} alt="preview Image" /> : 
                        <Form.Label>Select your picture to post ...</Form.Label>
                    }
                        <Form.Control type="file" accept='image/*' required
                        onChange={handleImage}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control type="text" placeholder="Your caption goes here..."
                        onChange={(e) =>setCaption(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                        Post !
                    </Button>
                </Form>
            </Card>

        </>
    )
}

export default NewPost