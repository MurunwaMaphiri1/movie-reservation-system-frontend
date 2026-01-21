import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import NavBar from './pages/components/Navbar';
import MovieDetails from './pages/MovieDetails';
import SeatReservations from './pages/SeatReservation';
import Success from './pages/Success';
import PaymentUnsuccessful from './pages/Failed';
import MyReservations from './pages/MyReservations';
import Footer from './pages/components/Footer';
import AdminPanel from './pages/AdminPanel';
import AdminSignIn from './pages/AdminSignIn';

function App() {

  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <Routes>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/get-movie/movie-id/:id' element={<MovieDetails/>}/>
            {/* <Route path='/seats/:id' element={<SeatReservations/>}/> */}
            <Route path='/seats/:userId/:id' element={<SeatReservations/>}/>
            <Route path='/confirm-reservation' element={<Success/>}/>
            <Route path='/cancelled-reservation' element={<PaymentUnsuccessful/>}/>
            <Route path='/my-reservations' element={<MyReservations/>}/>
            <Route path='/admin-panel' element={<AdminPanel/>}/>
            <Route path='/admin-sign-in' element={<AdminSignIn/>}/>
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  )
}

export default App
