import React from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {darkTheme} from './utils/Theme'; 
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  
import Navbar from './components/Navbar';
import {ToastContainer} from "react-hot-toast";

const Container = styled.div`
width:100%
height: 100%,
display: flex;
background: ${({theme})=> theme.bg};
color: ${({theme})=> theme.text_primary};
overflow-x: hidden;
overflow-y: hidden;
transition: all 0.5s ease;`;

const Wrapper= styled.div`
height: 100%, 
position: relative;
display: flex;
flex-direction: column;
justify-content: space-between;
flex: 3`;

function App() {
  return (
<ThemeProvider theme={darkTheme}>
<Container>
  <Wrapper>
    <BrowserRouter>
        <Navbar />
        <ToastContainer position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/post' element={<CreatePost/>}/>
      </Routes>
    </BrowserRouter>
  </Wrapper>
</Container>
  </ThemeProvider>
  );
}



export default App;
