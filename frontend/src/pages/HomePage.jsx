import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center w-96">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to HomePage</h1>
        <p className="text-gray-700 mb-6">You are logged in as an Admin.</p>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
