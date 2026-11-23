import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../constants/UserContext";

export default function MyReservations() {
    const [reservation, setReservation] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userContext = useContext(UserContext);

    // Token expired or invalid: clear it and send the user back to log in
    const handleUnauthorized = () => {
        localStorage.removeItem("authToken");
        userContext?.setToken(null);
        navigate("/userauth");
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setName(decodedToken.Name);
                fetchUserReservations();
            } catch (error) {
                console.error("Error occurred while decoding token: ", error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserReservations = async () => {
        setLoading(true);
        try {
            // The backend works out whose reservations these are from the token
            const res = await fetch(`http://localhost:7035/api/moviereservations/my-reservations`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            if (res.status === 401) {
                handleUnauthorized();
                return;
            }

            if (res.status === 429) {
                alert("You're going a bit fast. Please wait a moment and refresh.");
                return;
            }

            // 404 just means this user has no reservations yet
            if (res.status === 404) {
                setReservation([]);
                return;
            }

            if (!res.ok) {
                throw new Error(`HTTP error!! status: ${res.status}`);
            }

            const data = await res.json();
            setReservation(data);
        } catch (error) {
            console.error("Error occurred while getting reservation data: ", error);
        } finally {
            setLoading(false);
        }
    };

    const cancelReservation = async (item) => {
        try {
            // Reservation code + email prove ownership
            const res = await fetch(`http://localhost:7035/api/moviereservations/delete?code=${encodeURIComponent(item.reservationCode)}&email=${encodeURIComponent(item.email)}`, {
                method: "DELETE",
                mode: "cors",
                credentials: "same-origin"
            });

            if (res.status === 429) {
                alert("You're going a bit fast. Please wait a moment and try again.");
                return;
            }

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            fetchUserReservations();
        } catch (error) {
            console.error("Error occurred while cancelling reservation: ", error);
        }
    };
    
    return (
        <>
            {name && (
                <h2 className="mb-4 text-3xl font-extrabold text-center text-white">
                    Welcome, {name}!<br /><br />
                </h2>
            )}

            {loading ? (
                <p className="text-gray-400 text-center">Loading your reservations...</p>
            ) : reservation && reservation.length > 0 ? (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Movie
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Reservation Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    TimeSlot
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Seat Numbers
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservation.map((item) => (
                                <tr 
                                    key={item.id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.fullName}
                                    </th>
                                    <td className="px-6 py-4">
                                        {item.movie?.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(item.reservationDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.timeSlot.timeSlot || `Time Slot ID: ${item.timeSlotId}`}
                                    </td>
                                    <td className="px-6 py-4">
                                        {Array.isArray(item.seatNumbers) 
                                            ? item.seatNumbers.join(", ") 
                                            : item.seatNumbers}
                                    </td>
                                    {new Date(item.reservationDate) <= new Date()? (
                                        <td className="px-6 py-4">
                                            <button 
                                                className="font-medium text-gray-400 dark:text-blue-500 hover:underline cursor-not-allowed"
                                                disabled
                                            >
                                                Cancel Reservation
                                            </button>
                                        </td>
                                    ) : (
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => cancelReservation(item)}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                Cancel Reservation
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-400 text-center">Nothing to see here 😵‍💫</p>
            )}
        </>
    );
}