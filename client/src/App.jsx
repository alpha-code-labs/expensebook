import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Homepage from './components/Main/Homepage'
import Pricing from './components/Pricing/Pricing'
import Pricing2 from './components/Pricing/Pricing2'
import AllBlogs from './components/Blogs/AllBlogs';
import BlogPage from './components/Blogs/BlogPage';


function App() {
  

  return (
    <>
      
      <main>
        <section>
        <Navbar/>
        </section>   
          <Router>
            <Routes>
              <Route path='/' element={<Homepage/>}/>
              <Route path='/pricing' element={<Pricing/>}/>
              <Route path='/integration' element={<Pricing2/>}/>
              <Route path='/blogs' element={<AllBlogs/>}/>
              <Route path='/blog-page' element={<BlogPage/>}/>
            </Routes>
          </Router>
        <section>
          <Footer/>
        </section> 

      </main>
    </>
  )
}

export default App
