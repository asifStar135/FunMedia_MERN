import React, { useState } from 'react'
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap'
import { AiOutlineHome, AiOutlineSearch, AiOutlinePlusCircle } from 'react-icons/ai';
import { BiUserCircle } from 'react-icons/bi'
import { NavLink } from 'react-router-dom';
import "./style.css"


const Header = () => {
    const expand = "sm";

    const [tab, setTab] = useState(window.location.pathname);

    return (
        <Navbar key='md' bg="dark" fixed='top' expand="md" className="mb-3">
            <Container fluid>
                <Navbar.Brand as={NavLink} to="/" className='d-flex align-items-center' onClick={()=> setTab("/")}>
                    <img src="./logo.png" className='logo-img'/>
                    <div className="heading">
                        <span className='r'>Fu</span><span className='b'>nM</span><span className='g'>ed</span><span className='y'>ia</span>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="end"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                            
                        </Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            <Nav.Link as={NavLink} to="/" className='d-flex  align-items-center' onClick={()=> setTab("/")}>{
                                tab === "/" ?
                                <AiOutlineHome className='icon active-link'/> :
                                <AiOutlineHome className='icon b'/>
                            }
                            <h3>Home</h3>
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/search" className='d-flex  align-items-center' onClick={()=> setTab("/search")}>{
                                tab === "/search" ?
                                <AiOutlineSearch className='icon active-link'/> :
                                <AiOutlineSearch className='icon y'/>
                            }
                            <h3>Search</h3>
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/newpost" className='d-flex align-items-center' onClick={()=> setTab("/newpost")}>{
                                tab === "/newpost" ?
                                <AiOutlinePlusCircle className='icon active-link'/> :
                                <AiOutlinePlusCircle className='icon r'/>
                            }
                            <h3>New Post</h3>
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/account" className='d-flex align-items-center' onClick={()=> setTab("/account")}>{
                                tab === "/account" ?
                                <BiUserCircle className='icon active-link'/> :
                                <BiUserCircle className='icon g'/>
                            }
                            <h3>Account</h3>
                            </Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    )
}

export default Header