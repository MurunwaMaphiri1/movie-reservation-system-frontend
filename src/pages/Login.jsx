import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res = await fetch(`https://localhost:7035/api/user/login`, {
            method: "POST",
            mode: "cors",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })

        if (!res.ok) {
          throw new Error(`HTTP error: status: ${res.status}`);
        }

        const data = await res.json();

        if (data.token) {
          localStorage.setItem('authToken', data.token);
          console.log('Saved token:', localStorage.getItem('authToken')); // Debug log
          setMessage(data.message);
          setFullName(data.fullName)
        }

    } catch(error) {
      console.error("Error logging in: ", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-md relative">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-8">Login</h1>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>
          
          <div>
            <input
              type="text"
              name="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>
          
          <button 
            type="submit"
            onClick={() => navigate("/")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Login
          </button>
        </form>
        
        {/* Login link */}
        <p className="text-gray-400 text-center mt-6">
          Don't have an account?{' '}
          <a
           href="/register" 
           onClick={() => navigate("/register")}
           className="text-blue-500 hover:text-blue-400"
           >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}