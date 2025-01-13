import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../contexts/AuthContext';
const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const handleLogout = async () => {
        try {
            await logout();
        }
        catch (error) {
            console.error('Failed to log out', error);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-100 flex flex-col justify-center items-center", children: _jsxs("div", { className: "bg-white p-8 rounded-xl shadow-md w-96", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Dashboard" }), _jsxs("p", { className: "mb-4", children: ["Welcome, ", currentUser?.email] }), _jsx("button", { onClick: handleLogout, className: "w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition", children: "Log Out" })] }) }));
};
export default Dashboard;
