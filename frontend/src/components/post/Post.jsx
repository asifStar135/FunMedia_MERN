import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Modal } from 'react-bootstrap'
import User from '../user/User'
import "./style.css";
import {AiOutlineHeart, AiFillHeart, AiOutlineDelete} from 'react-icons/ai'
import {FaRegCommentDots} from 'react-icons/fa'
import {BsBookmarkPlus, BsFillBookmarkCheckFill} from 'react-icons/bs'
import UserModal from '../UserModal';
import CommentModal from '../CommentModal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { commentOnPost, deletePost, getAllPosts, likePost, savePost } from '../../actions/PostActions';


const Comment = (props) =>{
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.postStore);

    const handleComment = async () =>{
        if(!comment){
            alert("Comment not be empty...!");
            return;
        }

        await dispatch(commentOnPost(props.postId, comment));
        await dispatch(getAllPosts());
        props.onHide();
    }
    return(
        <>
            <Modal
            {...props}
            centered>
                <Modal.Header>
                    <Modal.Title>Add comment on this post...</Modal.Title>
                </Modal.Header>                
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Control as="textarea" rows={2} autoFocus required placeholder='comment goes here...'
                        onChange={(e) => setComment(e.target.value)}/>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" type='submit' onClick={handleComment} disabled={loading}>
                    Comment
                </Button>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


const Post = (
    {postItem}
) => {
    const [viewLike, setViewLike] = useState(false);
    const [viewComment, setviewComment] = useState(false);
    const [makeComment, setMakeComment] = useState(false);
    const [likeCount, setLikeCount] = useState(postItem?.likes?.length);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [myPost, setMyPost] = useState(false);

    const dispatch = useDispatch()

    const {user} = useSelector(state => state.userStore);

    const handleLike = async () =>{
        liked ? setLikeCount(likeCount-1) : setLikeCount(likeCount+1);
        setLiked(!liked);
        await dispatch(likePost(postItem?._id));
        // await dispatch(getAllPosts());
    }
    const handleSave =() =>{
        setSaved(!saved);
        dispatch(savePost(postItem?._id));
    }
    const handleDelete = async() =>{
        const temp = window.confirm("Are you sure to delete this post...?");
        if(!temp) return;
        await dispatch(deletePost(postItem?._id));
        // window.location.reload();
        await dispatch(getAllPosts());
    }

    useEffect(() =>{
        if(postItem?.owner?._id === user?._id) setMyPost(true);

        if(postItem && postItem.likes && user.saved){
            postItem.likes.forEach(item =>{
                if(item._id === user._id){
                    setLiked(true);
                    return;
                }
            })

            user.saved.forEach(item =>{
                if(item === postItem._id){
                    setSaved(true);
                    return;
                }
            })
        }
    },[user, postItem])

  return(
    <Card className="post shadow">
        <div className="top">
            <div className="d-flex justify-content-between align-items-center">
                <User
                image={postItem?.owner?.image?.url}
                userName={postItem?.owner?.userName}
                id={postItem?.owner?._id}
                />

                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Delete this Post</Tooltip>}>
                <span className="d-inline-block">
                    {
                        myPost ? <AiOutlineDelete className='icon r' onClick={handleDelete}/> : null
                    }
                </span>
            </OverlayTrigger>
            </div>

            <p className='caption'>{postItem?.caption}</p>
        </div>

        <hr/>
        <img className='post-img' src={postItem?.image?.url} alt="post picture..."/>
        <span className='date'>Posted on {postItem.createdAt}</span>
        <hr/>

        <div className="bottom d-flex justify-content-between">
            <div className="react d-flex">

                <div className="like d-flex flex-row align-items-center">
                    {
                        liked ? <AiFillHeart className='icon r' onClick={handleLike}/> : <AiOutlineHeart className='icon r' onClick={handleLike}/>
                    }
                    
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Show Likes</Tooltip>}>
                        <span className="d-inline-block">
                        <p className="gr point"
                            onClick={() =>setViewLike(true)}>{likeCount} likes</p>
                        </span>
                    </OverlayTrigger>
                </div>

                    <UserModal 
                    onHide={() => setViewLike(false)}
                    title="Users liked this post..."
                    show={viewLike}
                    users={postItem?.likes}
                    />

                    <div className="comment align-items-center d-flex flex-row">
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Make Comment</Tooltip>}>
                            <span className="d-inline-block">
                                <FaRegCommentDots className='icon g'
                                onClick={()=>setMakeComment(true)}/>
                            </span>
                        </OverlayTrigger>


                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Show Comments</Tooltip>}>
                            <span className="d-inline-block">
                                
                            <p className="gr point"
                            onClick={() => setviewComment(true)}>{postItem?.comments?.length} comments</p>
                            </span>
                        </OverlayTrigger>
                    </div>
                    <Comment
                    onHide={() =>setMakeComment(false)}
                    show={makeComment}
                    postId={postItem._id}
                    />

                    <CommentModal
                    title="Comment on this post..."
                    show={viewComment}
                    onHide={()=> setviewComment(false)}
                    comments={postItem?.comments}
                    postid={postItem?._id}
                    />
                </div>

                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{saved ? "Unsave this post" : "Save this post"}</Tooltip>}>
                    <span className="d-inline-block">
                        {
                            saved ? <BsFillBookmarkCheckFill className='icon y' onClick={handleSave}/> :
                            <BsBookmarkPlus className='icon y' onClick={handleSave}/>
                        }
                    </span>
                </OverlayTrigger>
            </div>
    </Card>
  )
}

export default Post