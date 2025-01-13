import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const PreferencesPage = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
    const categories = [
        'Technology', 'Design', 'Startup', 'Programming', 'Marketing',
        'Finance', 'Science', 'Art', 'Writing', 'Entrepreneurship'
    ];
    const toggleCategory = (category) => {
        setSelectedCategories(prev => prev.includes(category)
            ? prev.filter(c => c !== category)
            : [...prev, category]);
    };
    const handleSubmit = () => {
        // TODO: Save preferences to Firestore
        navigate('/dashboard');
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4", children: _jsxs("div", { className: "bg-white p-8 rounded-xl shadow-md w-full max-w-md", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-center", children: "Select Your Newsletter Interests" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: categories.map(category => (_jsx("button", { onClick: () => toggleCategory(category), className: `py-2 px-4 rounded transition ${selectedCategories.includes(category)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`, children: category }, category))) }), _jsx("button", { onClick: handleSubmit, disabled: selectedCategories.length === 0, className: "w-full mt-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50", children: "Save Preferences" })] }) }));
};
export default PreferencesPage;
