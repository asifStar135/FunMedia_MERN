import React, { useEffect, useState } from 'react'
import { Card, Nav } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import "./style.css"

import {MdVerified} from "react-icons/md"


const User=({
    image, userName, id
})=>{
  const {user} = useSelector(state => state.userStore);
  const [followed, setFollowed] = useState(false);
  const [isMe, setIsMe] = useState(false);

  useEffect(() =>{
    if(user){
      if(user._id === id){
        setIsMe(true);
        return;
      }
      // console.log(user.followings);
      user.followings.forEach((item) =>{
        if(item.userName === userName){
          setFollowed(true);
        }
      })
    }
  }, [user, userName, setFollowed]);

  return(
    <Card className='d-flex flex-row user align-items-center justify-content-start'>
        <img src={image} alt={userName} className="user-img"/>
        {
          isMe ? <Nav.Link as={NavLink} to="/account"> <h4>{userName}</h4> </Nav.Link> :
          <Nav.Link as={NavLink} to={`/profile/${id}`}> <h4>{userName}</h4> </Nav.Link>
        }
        {
          followed ? <MdVerified className='icon b'/> : null
        }
    </Card>
  )
}


export default User