import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    // Function to fetch movies based on search input
    useEffect(() => {
        if (title.trim() === "") {
            axios.get(`https://localhost:7035/api/movie`)
                .then(response => setMovies(response.data))
                .catch(err => setError(err.message));
        } else {
            const searchMovies = async () => {
                try {
                    // Encode the title to handle spaces (%20) and special characters
                    const encodedTitle = encodeURIComponent(title);
                    const res = await fetch(`https://localhost:7035/api/movie/get-movie/movie-title/${encodedTitle}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    });

                    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                    
                    const data = await res.json();
                    setMovies(data); 
                } catch (error) {
                    console.error("Invalid input", error);
                    setMovies([]); 
                }
            };

            const timeout = setTimeout(() => searchMovies(), 500);

            return () => clearTimeout(timeout);
        }
    }, [title]);

    const handleMovieClick = (id) => {
        navigate(`/get-movie/movie-id/${id}`);
    };

    return (
        <>
            <div className="flex px-4 py-3 rounded-md border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-gray-600 mr-3 rotate-90">
                    <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                </svg>
                <input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    type="text" 
                    placeholder="Search for movie" 
                    className="w-full outline-none bg-transparent text-gray-600 text-sm" 
                />
            </div>

            <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(271px,1fr))] place-items-center sm:place-items-start md:place-items-start lg:place-items-start xl:place-items-start gap-4 p-4">
                {error && <p className="text-red-500">Error: {error}</p>}
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="w-[280px] p-4 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        onClick={() => handleMovieClick(movie.id)}
                    >
                        <div className="w-full relative">
                            <img
                                src={`${movie.image}`}
                                alt={movie.name}
                                className="w-full h-auto object-cover rounded"
                                loading="lazy"
                            />
                        </div>
                        <h3 className="text-lg font-semibold mt-2 text-white">{movie.title}</h3>
                    </div>
                ))}
            </div>
        </>
    );
}
