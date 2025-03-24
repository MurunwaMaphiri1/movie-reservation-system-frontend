import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem("authToken");
        setUsername(null);
        setMenuOpen(false);
        navigate("/login");
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log(decodedToken);
                setEmail(decodedToken.Email);
                setName(decodedToken.Name);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 w-full">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="\public\images\movie.png" className="h-8" alt="movie Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">MagicBox Theatres</span>
                </a>
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
                    <button
                        type="button"
                        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        id="user-menu-button"
                        onClick={toggleMenu}
                    >
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 rounded-full" src="/images/user.png" alt="user photo" />
                    </button>
                    <div
                        className={`z-50 ${menuOpen ? "block" : "hidden"} absolute top-full right-0 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
                        id="user-dropdown"
                    >
                        <div className="px-4 py-3">
                            <span className="block text-sm text-gray-900 dark:text-white">{`Hello, ${name}` || "Guest"}</span>
                            <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{email || "Guest"}</span>
                        </div>
                        <ul className="py-2" aria-labelledby="user-menu-button">
                            <li>
                                <button onClick={() => navigate(`/my-reservations`)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Reservations</button>
                            </li>
                            <li>
                                <button
                                    onClick={logOut}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    Sign out
                                </button>
                            </li>
                        </ul>
                    </div>
                    <button
                        data-collapse-toggle="navbar-user"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-user"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="https://www.flaticon.com/free-icon/profile-user_64572?term=user&page=1&position=6&origin=search&related_id=64572" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;