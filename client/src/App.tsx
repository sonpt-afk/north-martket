import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedPage from './components/ProtectedPage'
import Spinner from './components/Spinner'
import { RootState } from './redux/store'
import Profile from './pages/Profile'

function App() {
  const loading = useSelector((state: RootState) => state.loaders.loading);

  return (
    <>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedPage>
                <Home />

              </ProtectedPage>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedPage>
                      <Profile></Profile>


              </ProtectedPage>
            }
          />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
         

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App