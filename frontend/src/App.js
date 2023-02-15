import './App.css';
import React, { useEffect } from 'react';
import Header from './components/Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import Search from './components/search/Search';
import NewPost from './components/newPost/NewPost';
import Register from './components/register/Register';
import Account from './components/account/Account';
import Update from './components/update/Update';
import Login from './components/login/Login';
import Feedback from './components/feedback/Feedback';
import View from './components/view/View';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './actions/UserAction';

function App(){
  const {isAuthenticated, error, userMessage} = useSelector(state => state.userStore);
  const {postMessage, error:postError} = useSelector(state => state.postStore);

  const dispatch = useDispatch();

  useEffect(() =>{
    const fn =async() =>{
      await dispatch(loadUser());
    }
    fn();
  },[dispatch]);


  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login/> : <Home/>}/>
        <Route path="/search" element={!isAuthenticated ? <Login/> : <Search/>}/>
        <Route path='/newpost' element={!isAuthenticated ? <Login/> : <NewPost/>}/>
        <Route path='/account' element={!isAuthenticated ? <Login/> : <Account/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/account/update" element={!isAuthenticated ? <Login/> : <Update/>}/>
        <Route path="/feedback" element={!isAuthenticated ? <Login/> : <Feedback/>}/>
        <Route path="/profile/:id" element={!isAuthenticated ? <Login/> : <View/>}/>
      </Routes>
    </>
  );
}

export default App;
