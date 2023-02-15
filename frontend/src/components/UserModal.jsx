import { Button, Modal } from "react-bootstrap";
import User from "./user/User";

const UserModal = (props)=>{
    return (
      <Modal
        {...props}
        centered
        className="user-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h4>{props.title}</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {
                props?.users?.length > 0 ? props.users.map((item) =>(
                    <User image={item?.image?.url}
                    userName={item?.userName}
                    id={item?._id}
                    key={item?._id}
                    />
                )) : <h3>No User to show...!</h3>
            }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default UserModal