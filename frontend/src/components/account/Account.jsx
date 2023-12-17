import React, { useEffect, useState } from 'react'
import {Button, ButtonGroup, Card, Nav, OverlayTrigger, ToggleButton, Tooltip} from "react-bootstrap"
import {BiUserPin, BiUserCheck} from "react-icons/bi"
import {BsCalendarCheck, BsBookmarkHeart} from "react-icons/bs"
import "./style.css"
import {NavLink, useNavigate} from "react-router-dom"
import Post from '../post/Post'
import UserModal from '../UserModal'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader'
import { deleteUser, getAllUsers, loadUser, logOutUser } from '../../actions/UserAction'
import { getAllPosts } from '../../actions/PostActions'




const Account = () => {
    const [foll, setFoll] = useState(false);
    const [flwing, setFlwing] = useState(false);
    const [myPostVar, setMyPostVar] = useState("");
    const [savedPostVar, setSavedPostVar] = useState("");
    const [radioValue, setRadioValue] = useState(1);

    const {user, loading, userMessage, error} = useSelector(state => state.userStore);
    const {allPosts, loading:postLoading} = useSelector(state => state.postStore);
    const [myPosts, setMyPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut =() =>{
        const text = window.prompt("Type 'yes' to confirm...");
        if(text === "Yes" || text === "YES" || text === "yes"){
            dispatch(logOutUser());
        }
    }

    const handleDelete = async () =>{
        const text = window.prompt("Enter your password...");
        await dispatch(deleteUser(text));
    }

    useEffect(() =>{
        if(allPosts){
            let tempSave =[], tempMy = [];
            
            allPosts.forEach(item =>{
                if(item?.owner?.userName === user?.userName){
                    tempMy.push(item);
                }
                
                let ind = user?.saved?.indexOf(item?._id);
                if(ind != -1) tempSave.push(item);
            })
            setSavedPosts(tempSave);
            setMyPosts(tempMy);
        }
    },[allPosts]);

    useEffect(() =>{
        const fn = async() =>{
        if(userMessage === "logged out...!" || userMessage === "user deleted...!"){
            alert(userMessage);
            await dispatch({
                type:"clearMessages"
            })
            navigate("/login");
        }
        fn();
    }
    },[userMessage, error, dispatch])

    useEffect(() =>{
        const fn = async() =>{
            await dispatch(loadUser());
            await dispatch(getAllPosts());
            await dispatch(getAllUsers());
        }
        fn();
        const wd = window.innerWidth;
        if(wd < 1200){
            setSavedPostVar("none");
            document.querySelector(".d").style.display = "none";
        }
    },[dispatch])

  return (
    (loading) ? <Loader/> :
    <div className='account'>
        <Card className="profile d-flex flex-row justify-content-around">
            <Card className="left text-align-center">
                <img src={user?.image?.url} alt={user?.userName} className="profile-img" />
                <hr />
                <h3>{user?.name}</h3>
                <hr/>
                <div className="details">
                    <div className="d-flex name align-items-center b">
                        <BiUserPin className='icon'/>
                        <h4>{user?.userName}</h4>
                    </div>

                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Show Followers</Tooltip>}>
                    <span className="d-inline-block">
                        
                    <div className="d-flex foll point align-items-center r">
                        <BsBookmarkHeart className='icon' size={28}/>
                        <h4 onClick={() =>setFoll(true)}>{user?.followers?.length} followers</h4>
                    </div>
                    </span>
                    </OverlayTrigger>


                    <UserModal
                        onHide={() => setFoll(false)}
                        show={foll}
                        users={user?.followers}
                        title={`Followers of ${user?.userName}`}
                    />

                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Show Followings</Tooltip>}>
                        <span className="d-inline-block">
                            <div className="d-flex folg point align-items-center y">
                                <BiUserCheck className='icon' size={28}/>
                                <h4 onClick={() =>setFlwing(true)}>{user?.followings?.length} followings</h4>
                            </div>
                        </span>
                    </OverlayTrigger>

                    <UserModal
                        onHide={() => setFlwing(false)}
                        show={flwing}
                        users={user?.followings}
                        title={`Followings of ${user?.userName}`}
                    />
                    <div className="d-flex date align-items-center g">
                        <BsCalendarCheck className='icon' size={28}/>
                        <h4>joined {user?.joinDate}</h4>
                    </div>
                </div>
            </Card>
            <Card className="right">
                <div className="heading">
                    <span className="b">Pro</span><span className="r">file </span><span className="y">Util</span><span className="g">ities</span>
                </div>
                <div className="controls">
                    <Button variant='outline-primary'>
                        <Nav.Link as={NavLink} to="/account/update">
                            Update Profile
                        </Nav.Link>
                    </Button>
                    <br />
                    <Button variant='outline-success'>
                        <Nav.Link as={NavLink} to="/newpost">
                            Create New Post
                        </Nav.Link>
                    </Button>
                    <Button variant='outline-warning'>
                        <Nav.Link as={NavLink} to="/feedback">
                            Give a Feedback
                        </Nav.Link>
                    </Button>
                    <br />
                    <Button variant='outline-secondary' onClick={handleLogOut}>
                        Log Out
                    </Button>
                    <br />
                    <Button variant='outline-danger' onClick={handleDelete}>
                        Delete Account !
                    </Button>
                </div>
            </Card>
        </Card>
        <Card className="showPosts justify-content-around">
            <ButtonGroup>
                <ToggleButton
                    key={1}
                    id={`radio-${1}`}
                    type="radio"
                    variant='outline-primary'
                    name="radio"
                    checked={radioValue === 1}
                    onChange={() => setRadioValue(1)}
                    onClick={()=>{setMyPostVar("");setSavedPostVar("none")}}
                >
                    Your posts
                </ToggleButton>
                <ToggleButton
                    key={2}
                    id={`radio-${2}`}
                    type="radio"
                    variant='outline-primary'
                    name="radio"
                    checked={radioValue === 2}
                    onChange={() => setRadioValue(2)}
                    onClick={()=>{setMyPostVar("none");setSavedPostVar("")}}
                >
                    Saved items
                </ToggleButton>
            </ButtonGroup>

            <div className="d-flex show justify-content-around">
                <div className={`myPosts ${myPostVar}`}>
                    <h3>Your posts are Here...</h3>
                    {
                        (myPosts.length > 0) ? 
                        myPosts.map((item)=>(
                            <Post
                            postItem={item}
                            key={item._id}
                            />
                        )) :
                        <h3 className='temp'>Your haven't posted yet...!</h3>
                    }
                </div>
                <div className="d"></div>
                <div className={`savedPosts ${savedPostVar}`}>
                    <h3>Your Saved Items...</h3>
                    {
                        (savedPosts.length > 0) ? 
                        savedPosts.map((item) =>(
                            <Post
                            postItem={item}
                            key={item._id}
                            />
                        )) : <h3 className='temp'>Your have no Saved Items...!</h3>
                    }
                </div>
            </div>
        </Card>
    </div>
  )
}

export default Account