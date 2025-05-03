import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import { loadStripe } from "@stripe/stripe-js";

export default function SeatReservations() {
    const { id } = useParams();
    const { userId } = useParams();

    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [movieName, setMovieName] = useState("");
    const [timeSlotId, setTimeSlotId] = useState(0);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [ticketPrice, setTicketPrice] = useState(100); // Default price per seat
    const [selectedMoviePoster, setSelectedMoviePoster] = useState(null);

    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const pkKey = `${import.meta.VITE_PK_TEST_KEY}`;

    useEffect(() => {
        const fetchMovieName = async() => {
            try {
                const name = await fetch(`https://localhost:7035/api/movie/get-movie/movie-id/${id}`, {
                    method: "GET",
                    mode: "cors",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!name.ok) {
                    throw new Error(`HTTP error: status: ${name.status}`);
                }

                const data = await name.json();
                setMovieName(data.title);
                setSelectedMoviePoster(data.image);

            } catch(error) {
                console.error("Error occurred while fetching movie name: ", error);
                setError(error);
            }
        };
        fetchMovieName();
    },[])

    useEffect(() => {
        const fetchTimeSlotId = async() => {
            const timeres = await fetch(`https://localhost:7035/api/timeslots/get-timeSlotId-by-time-string?timeString=${time}`, {
                method: "GET",
                mode: "cors",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!timeres.ok) {
                throw new Error(`HTTP error: status: ${timeres.status}`);
            } 

            const timeSlotId = await timeres.json();
            setTimeSlotId(timeSlotId);
        }
        fetchTimeSlotId();
    }, [time])

    useEffect(() => {
        const fetchTakenSeats = async() => {
            try {
                const res = await fetch(`https://localhost:7035/api/moviereservations/taken-seats/${id}/${date}/${timeSlotId}`, {
                    method: "GET",
                    mode: "cors",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
    
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
    
                const takenSeats = await res.json();
                setOccupiedSeats(takenSeats);
                //Debugging Purposes
                // console.log(takenSeats);
                // console.log(`https://localhost:7035/api/moviereservations/taken-seats/${id}/${formattedDate}/${timeSlotId}`)
            } catch(error) {
                console.error("Error fetching taken seats: ", error);
            }
        }
        fetchTakenSeats();
    }, [id, date, timeSlotId]);

    const handleSeatClick = (seatId) => {
        if (occupiedSeats.includes(seatId)) {
            return; // Seat is occupied, do nothing
        }

        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(seat => seat !== seatId);
            } else {
                return [...prev, seatId];
            }
        });

    };

    const getSeatStatus = (seatId) => {
        if (occupiedSeats.includes(seatId)) {
            return "occupied";
        }
        if (selectedSeats.includes(seatId)) {
            return "selected";
        }
        return "available";
    };

    const createReservation = async() => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        try {

            const stripe = await loadStripe(pkKey)
            console.log(stripe)

            const res = await fetch(`https://localhost:7035/api/moviereservations/create-checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({             
                    UserId: parseInt(userId),
                    MovieId: parseInt(id),
                    ReservationDate: date,
                    TimeSlotId: parseInt(timeSlotId),
                    SeatNumbers: selectedSeats, })
            });

            if (!res.ok) {
                throw new Error(`HTTP error: status: ${res.status}`);
            }

            const data = await res.json();
            
            // alert("Reservation successful!");
            await stripe.redirectToCheckout({ sessionId: data.sessionId })

        } catch(error) {
            console.error(`Error occurred`, error);
            setError(error);
            alert("Failed to create reservation. Please try again.");
        }
    };


    // Generate rows A-G and columns 1-13
    const rows = ["A", "B", "C", "D", "E", "F", "G"];
    const totalRows = rows.length;
    const columns = Array.from({ length: 13 }, (_, i) => i + 1);

    return (
        <div className="flex flex-col items-center justify-center my-5 p-4 min-h-screen bg-gray-900">
            <div className="w-full max-w-5xl">
                <div className="flex flex-col items-center mb-8">
                  <div className="flex justify-center mb-6">
                      <div className="rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
                          <img
                              src={selectedMoviePoster}
                              className="w-64 h-auto object-cover"
                          />
                      </div>
                  </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{movieName}</h1>
                    <div className="text-gray-300 mb-4">
                        <span>{date}</span> • <span>{time}</span>
                    </div>

                    <ul className="flex justify-between bg-black bg-opacity-30 rounded-lg px-6 py-3 mb-6">
                        <li className="flex items-center mx-4">
                            <div className="w-6 h-6 bg-gray-600 rounded"></div>
                            <small className="ml-2 text-gray-300">Available</small>
                        </li>
                        <li className="flex items-center mx-4">
                            <div className="w-6 h-6 bg-blue-500 rounded"></div>
                            <small className="ml-2 text-gray-300">Selected</small>
                        </li>
                        <li className="flex items-center mx-4">
                            <div className="w-6 h-6 bg-white rounded"></div>
                            <small className="ml-2 text-gray-300">Occupied</small>
                        </li>
                    </ul>

                    {/* Screen */}
                    <div className="w-4/5 mb-12">
                        <div className="w-full h-3 bg-purple-500 rounded-t-full"></div>
                        <div className="text-center text-purple-500 font-semibold mt-1">SCREEN</div>
                        <div className="text-center text-blue-400 text-sm mb-12">Front of cinema</div>
                    </div>

                    {/* Seat Grid */}
                    <div className="w-full overflow-x-auto pb-4">
                        <div className="flex flex-col items-center">
                            {rows.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex gap-2 mb-2 w-full justify-center">
                                    {columns.map((col) => {
                                        const seatId = `${row}${col}`;
                                        const status = getSeatStatus(seatId);
                                        
                                        return (
                                            <button
                                                key={seatId}
                                                className={`
                                                    w-10 h-10 flex items-center justify-center rounded
                                                    text-xs font-medium transition-all duration-200
                                                    ${status === 'available' ? 'bg-gray-600 hover:bg-gray-500 text-white' : ''}
                                                    ${status === 'selected' ? 'bg-blue-500 text-white' : ''}
                                                    ${status === 'occupied' ? 'bg-white text-gray-800 cursor-not-allowed' : ''}
                                                `}
                                                onClick={() => handleSeatClick(seatId)}
                                                disabled={status === 'occupied'}
                                            >
                                                {seatId}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-white mt-8 mb-6 text-center">
                        You have selected <span className="text-blue-500 font-semibold">{selectedSeats.length}</span> seats 
                        for the total price of R <span className="text-blue-500 font-semibold">{selectedSeats.length * ticketPrice}</span>
                    </div>

                    <button
                        className={`px-8 py-3 rounded-lg font-semibold ${
                            selectedSeats.length > 0 
                                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        } transition-colors duration-200`}
                        onClick={createReservation}
                        disabled={selectedSeats.length === 0}
                    >
                        Book Tickets
                    </button>
                </div>
            </div>
        </div>
    );
}
