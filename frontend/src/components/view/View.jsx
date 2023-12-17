import React, { useEffect, useState } from 'react'
import { Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { BiUserCheck, BiUserPin } from 'react-icons/bi'
import { BsBookmarkHeart, BsCalendarCheck } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllPosts } from '../../actions/PostActions'
import { findUser, followUser } from '../../actions/UserAction'
import Loader from '../Loader'
import Post from '../post/Post'
import UserModal from '../UserModal'
import "./style.css"



const View = () => {
    const [foll, setFoll] = useState(false);
    const [flwing, setFlwing] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [post, setPost] = useState();

    const {user, foundUser, loading} = useSelector(state => state.userStore);
    const {loading:postLoading, allPosts} = useSelector(state => state.postStore);

    const params = useParams();
    const dispatch = useDispatch();

    const handleFollow =() =>{
        dispatch(followUser(foundUser?._id));
        setFollowed(!followed);
    }



    useEffect(() =>{
        const fn = async() =>{
            user.followings.forEach(item =>{
                if(item.userName === foundUser?.userName){
                    setFollowed(true);
                    return;
                }
            })
        }
        fn();
    },[dispatch, params.id, foundUser])

    useEffect(() =>{
        dispatch(findUser(params.id));
        dispatch(getAllPosts());
    },[])


  return (
    loading ? <Loader/> :
    <div className="view d-flex">
        <Card className="left text-align-center">
            <img src={foundUser?.image?.url} alt={foundUser?.userName} className="profile-img" />
            <hr />
            <h3>{foundUser?.name}</h3>
            <hr/>
            <div className="details">
                    <div className="d-flex name align-items-center b">
                        <BiUserPin className='icon'/>
                        <h4>{foundUser?.userName}</h4>
                    </div>

                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Show Followers</Tooltip>}>
                    <span className="d-inline-block">
                        <div className="d-flex foll point align-items-center r">
                            <BsBookmarkHeart className='icon'/>
                            <h4 onClick={() =>setFoll(true)}>{foundUser?.followers?.length} followers</h4>
                        </div>
                    </span>
                    </OverlayTrigger>


                    <UserModal
                        onHide={() => setFoll(false)}
                        show={foll}
                        users={foundUser?.followers}
                        title={`Followers of ${foundUser?.userName}`}
                    />

                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Show Followings</Tooltip>}>
                        <span className="d-inline-block">
                            <div className="d-flex folg point align-items-center y">
                                <BiUserCheck className='icon'/>
                                <h4 onClick={() =>setFlwing(true)}>{foundUser?.followings?.length} followings</h4>
                            </div>
                        </span>
                    </OverlayTrigger>

                    <UserModal
                        onHide={() => setFlwing(false)}
                        show={flwing}
                        users={foundUser?.followings}
                        title={`Followings of ${foundUser?.userName}`}
                    />
                    <div className="d-flex date align-items-center g">
                        <BsCalendarCheck className='icon'/>
                        <h4>joined {foundUser?.joinDate}</h4>
                    </div>
                </div>
                {
                    followed ? 
                    <Button variant='outline-secondary' style={{width:"30%", margin:"14px auto 0 auto"}} onClick={handleFollow}>Unfollow !</Button> :
                    <Button variant='outline-primary' style={{width:"30%", margin:"14px auto 0 auto"}} onClick={handleFollow}>Follow !</Button>
                }
        </Card>
        <Card className="right">
            <h3>All Post of {foundUser?.userName}</h3>
            <div className="posts">
                {
                    foundUser?.posts?.length > 0 ? foundUser.posts.map((item) =>(
                        <Post
                        postItem={{...item, ["owner"]:foundUser}}
                        key={item._id}
                        />
                    )) : <h4 className='temph'>No posts to show...!</h4>
                }
            </div>
        </Card>
    </div>
  )
}

export default View