import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res = await fetch(`https://localhost:7035/api/user/register`, {
            method: "POST",
            mode: "cors",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fullName, email, password })
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setMessage(data.message);
    } catch(error) {
      console.error("Error signing up: ", error);
      setMessage("Error signing up, Please try again");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-md relative">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-8">Create an Account</h1>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              id="FullName"
              type="text"
              name="FullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>
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
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Register
          </button>
        </form>
        
        {/* Login link */}
        <p className="text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <a
           href="/login" 
           onClick={() => navigate("/login")}
           className="text-blue-500 hover:text-blue-400"
           >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}