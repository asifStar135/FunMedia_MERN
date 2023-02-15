import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./style.css"
import { Form, Card } from 'react-bootstrap'
import User from '../user/User';
import {getAllUsers} from "../../actions/UserAction"


const Search = () => {

    const {allUsers} = useSelector(state => state.allUserStore);
    const {user} = useSelector(state => state.userStore);
    const [input, setInput] = useState("");
    const [filterItems, setFilterItems] = useState([]);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(allUsers){
            let curr = [];
            allUsers.filter((item)=>{
                if(input != "" && item.userName.includes(input)){
                    curr.push(item);
                }
            })
            setFilterItems(curr);
        }
    }, [input, allUsers])

    useEffect(() =>{
        dispatch(getAllUsers());
    },[dispatch]);


    return (
        <>
            <Card className='search'> 
                <div className="heading">
                    <span className='g'>Search </span><span className='b'>All </span><span className='y'>Users </span><span className='r'> Here</span>
                </div>

                <User 
                image={user.image.url}
                userName={user.userName}
                id={user._id}
                />

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Enter username to search..."
                    onChange={(e)=>setInput(e.target.value)} 
                    autoComplete="off"/>
                </Form.Group>
                <hr/>

                <Card className="users">
                    {
                        filterItems.length == 0 ?
                        <h4 className='h'>No users are there...</h4> :
                        <div className="show">
                            <h5>Searched Users...</h5>
                            {
                                filterItems.map((item)=>(
                                    <User
                                    key={item._id}
                                    image={item.image.url}
                                    userName={item.userName}
                                    id={item._id}
                                    />
                                ))
                            }
                        </div>
                    }
                </Card>
            </Card>
        </>
    )
}

export default Search