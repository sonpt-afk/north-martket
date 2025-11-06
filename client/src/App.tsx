import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedPage from './components/ProtectedPage'
import Spinner from './components/Spinner'
import { RootState } from './redux/store'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import ProductInfo from './pages/ProductInfo'
import ActivityDashboard from './components/ActivityDashboard'

function App() {
  const loading = useSelector((state: RootState) => state.loaders.loading)

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
                <Profile />
              </ProtectedPage>
            }
          />
          <Route
            path='/admin'
            element={
              <ProtectedPage>
                <Admin />
              </ProtectedPage>
            }
          />
          <Route
            path='/product/:id'
            element={
              <ProtectedPage>
                <ProductInfo />
              </ProtectedPage>
            }
          />
          <Route
            path='/activity-dashboard'
            element={
              <ProtectedPage>
                <ActivityDashboard />
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
