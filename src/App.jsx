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

function App() {

  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900">
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
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  )
}

export default App
