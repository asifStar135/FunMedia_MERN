import React, { useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../../actions/PostActions';
import {loadUser, getAllUsers} from "../../actions/UserAction"
import Loader from '../Loader';
import Post from '../post/Post'
import User from '../user/User';
import "./style.css"

const Home = () => {
  const {allUsers, loading:userLoading} = useSelector(state => state.allUserStore);
  const {allPosts, loading:postLoading} = useSelector(state => state.postStore);
  const {user, loading} = useSelector(state => state.userStore);
  const dispatch = useDispatch();

  useEffect(() =>{
    const fn = async() =>{
      await dispatch(loadUser());
      await dispatch(getAllPosts());
      await dispatch(getAllUsers());
    }
    fn();
  },[dispatch])

  const ar = [1,2,3];

  return (
    (loading || userLoading) ? <Loader/> :
      <div className="home d-flex justify-content-around">
        <div className="left">
          <h3>Here are all users of Funmedia.... Except you 😅</h3>
          {
            allUsers?.map((item) =>(
              item?.name === user?.name ? null :
              <User
              key={item?._id}
              image={item?.image?.url}
              userName={item?.userName}
              id={item?._id}/>
            ))
          }
        </div>

        <Card className='right d-flex flex-col'>
          { allPosts?.length > 0  ? 
            allPosts?.map((item) =>(
              <Post
              key={item?._id}
              postItem={item}
              />
            )) : <h1 className='noPost'>There are not Post to show...!</h1>
          }
        </Card>
      </div>
  )
}

export default Home