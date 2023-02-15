import { Button, Modal } from "react-bootstrap";
import User from "./user/User";
import {BsArrowRightCircle} from 'react-icons/bs'
import {MdDeleteForever} from 'react-icons/md'
import { useDispatch, useSelector } from "react-redux";
import { deletComment, getAllPosts } from "../actions/PostActions";
import { useEffect } from "react";


const CommentModal = (props)=>{
  const dispatch = useDispatch();
  const {message, error} = useSelector(state => state.postStore);
  const {user} = useSelector(state => state.userStore);

    const handleDelete = async(commentId) =>{
      const temp = window.confirm("Are you sure..?");
      if(!temp) return ;
      // console.log(commentId);
      await dispatch(deletComment(props.postid, commentId));
      await dispatch(getAllPosts());
    }

    useEffect(() =>{
      if(error) alert(error);
      // if(message) alert(message);
    },[error, message])

    return (
      <Modal
        {...props}
        className="comment-modal"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h4>{props.title}</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="comment-modal-item">
          {
            props?.comments?.length ? props.comments.map((item) =>(
                <div key={item.id}>
                <div className="d-flex align-items-center com-user">
                    <User image={item?.user?.image?.url}
                    userName={item?.user?.userName}
                    id={item?.user?._id}
                    />
                    {
                      item.user.userName === user.userName ? <MdDeleteForever className="icon r" onClick={() =>handleDelete(item.id)}/> : null
                    }
                </div>
                <div className="d-flex align-items-center">
                    <BsArrowRightCircle className="icon b"/>
                    <h5 style={{display:"inline",marginLeft:".5rem"}}>{item?.comment}</h5>
                </div>
                <hr/>
                </div>
            )) : <h3>No comments are there...</h3>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default CommentModal