import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function MovieDetails() {
    const { id } = useParams();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState("");

        useEffect(() => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setUserId(decodedToken.Id);
                } catch (error) {
                    console.error("Error decoding token:", error);
                }
            }
        }, []);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const res = await fetch(`https://localhost:7035/api/movie/get-movie/movie-id/${id}`, {
                    method: "GET",
                    mode: "cors",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/json" },
                });

                const timeSlotRes = await fetch(`https://localhost:7035/api/timeslots/`, {
                    method: "GET",
                    mode: "cors",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/json" }
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                if (!timeSlotRes.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                const time = await timeSlotRes.json();
                setSelectedMovie(data);
                setTimeSlots(time);
                

            } catch (error) {
                console.error("Error fetching data: ", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    // Function to generate available dates (next 7 days)
    const getAvailableDates = () => {
        let dates = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            let date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        
        return dates;
    };
    
    // Format date for display
    const formatDateForDisplay = (date) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric', timezone: 'Africa/Johannesburg' };
        return date.toLocaleDateString('en-ZA', options);
    };
    
    // Check if date is today
    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };
    
    // Handle date selection
    const handleDateSelect = (date) => {
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        navigate(`/seats/${userId}/${id}?date=${selectedDate}&time=${encodeURIComponent(time)}`);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;
    }

    if (!selectedMovie) {
        return <div className="flex justify-center items-center h-screen">No movie data found.</div>;
    }

    function isTimePassed(dateString, timeString) {
        const now = new Date();

        const selectedDateTime = new Date(`${dateString}T${timeString}:00`);

        return selectedDateTime < now;
    } 

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-4xl w-full">
                {/* Movie Poster Image with Border */}
                <div className="flex justify-center mb-6">
                    <div className="rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
                        <img
                            src={selectedMovie.image}
                            alt={selectedMovie.title}
                            className="w-64 h-auto object-cover"
                        />
                    </div>
                </div>
                
                {/* Movie Title*/}
                <h1 className="text-4xl font-bold text-center text-purple-500 mb-6">
                    {selectedMovie.title}
                </h1>
                
                {/* Genre Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {selectedMovie.genres?.map((genre, index) => (
                        <span 
                            key={index} 
                            className="px-3 py-1 bg-purple-800 text-white text-sm rounded-full"
                        >
                            {genre}
                        </span>
                    ))}
                </div>
                
                {/* Synopsis Section*/}
                <div className="mb-8">
                    <h2 className="text-2xl text-cyan-400 mb-4">Synopsis:</h2>
                    <p className="text-gray-300 leading-relaxed">
                        {selectedMovie.description}
                    </p>
                </div>
                
                {/* Additional Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                    {selectedMovie.directedBy && (
                        <div>
                            <h3 className="text-lg text-cyan-400 mb-2">Director:</h3>
                            <p>{selectedMovie.directedBy}</p>
                        </div>
                    )}
                    
                    {selectedMovie.releaseDate && (
                        <div>
                            <h3 className="text-lg text-cyan-400 mb-2">Release Date:</h3>
                            <p>{new Date(selectedMovie.releaseDate).toLocaleDateString()}</p>
                        </div>
                    )}
                    
                    {selectedMovie.duration && (
                        <div>
                            <h3 className="text-lg text-cyan-400 mb-2">Duration:</h3>
                            <p>{selectedMovie.duration}</p>
                        </div>
                    )}
                    
                    {selectedMovie.actors && (
                        <div>
                            <h3 className="text-lg text-cyan-400 mb-2">Actors:</h3>
                            <p>{selectedMovie.actors.join(", ")}</p>
                        </div>
                    )}
                </div><br></br>
                <hr></hr>
                <br></br>
                <div className="mb-4">
                    <h2 className="text-2xl text-cyan-400 mb-4">Confirm your date and time for reservation:</h2>
                </div>
                
                {/* Date Picker */}
                <div className="mb-6">
                    <div className="grid grid-cols-7 gap-2">
                        {getAvailableDates().map((date, index) => (
                            <div 
                                key={index}
                                onClick={() => handleDateSelect(date)}
                                className={`
                                    cursor-pointer rounded-lg p-3 text-center transition-colors 
                                    ${selectedDate === date.toISOString().split('T')[0] 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-gray-800 hover:bg-gray-700 text-gray-200'}
                                `}
                            >
                                <div className="text-xs mb-1">
                                    {isToday(date) ? 'Today' : date.toLocaleDateString('en-ZA', { weekday: 'short' })}
                                </div>
                                <div className="font-bold">
                                    {date.getDate()}
                                </div>
                                <div className="text-xs">
                                    {date.toLocaleDateString('en-ZA', { month: 'short' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div
                    className="col-sm-4 w-full col-xs-12 bg-gray-800 border rounded-lg border-gray-800 pt-1.5 pb-2 pl-6 mb-4 mr-4"
                >
                <div className="row">
                    <div className="col-xs-6">
                        <span className="text-sm text-gray-300">Ticket type</span>
                        <h3 className="text-lg font-bold">VIP | 2D</h3>
                    </div>
                    <div className="col-xs-6 text-right">
                        <h3 className="text-lg font-bold">
                            <span className="pr-2.5">R&nbsp;{selectedMovie.ticketPrice}</span>
                        </h3>
                    </div>
                </div>
                <div className="row">
                    <div className="times_container grid grid-cols-3 gap-2 mt-4">
                        {timeSlots.map((timeSlot, index) => (
                            <div key={index}> 
                                <button onClick={() => handleTimeSelect(timeSlot.timeSlot || timeSlot)} 
                                    className="btn-time cursor-pointer btn-block active_session bg-blue-500 text-white px-4 py-2 rounded block text-center" > 
                                        {timeSlot.timeSlot || timeSlot} 
                                </button> 
                            </div> 
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}