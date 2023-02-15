import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import User from '../user/User'
import "./style.css"

const Feedback = () => {
    const {user} = useSelector(state => state.userStore);

  return (
    <Card className='feedback'>
        <div className="heading">
        <span className="b">Give </span><span className="y">Your </span><span className="r">Feed</span><span className="g">back !</span>
        </div>

        <User image={user?.image.url}
        id={user?._id} userName={user?.userName}/>

        <Form action='https://formspree.io/f/xvonokyv' method='post'>
            <Form.Group className="mb-3">
                <Form.Control type="text" placeholder='Tell us your name...' name="name"/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type="email" placeholder="Enter your Email..." name='email'/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control as="textarea" rows={3} placeholder='Your valuable feedback here...' name='feedback message'/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Send
            </Button>
        </Form>
    </Card>
  )
}

export default Feedback