import React, { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ " + res.data.message);
    } catch (err) {
      setMessage("❌ Upload failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Navbar */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">RecruitAI Dashboard</h1>
          <nav>
            <ul className="flex space-x-8 text-sm font-medium">
              <li className="hover:underline cursor-pointer">Home</li>
              <li className="hover:underline cursor-pointer">Profiles</li>
              <li className="hover:underline cursor-pointer">Settings</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm p-6 hidden lg:block">
          <h2 className="text-lg font-semibold mb-6">Menu</h2>
          <ul className="space-y-4 text-gray-700 text-base">
            <li className="hover:text-blue-600 cursor-pointer flex items-center">
              📄 <span className="ml-2">Create Job Profile</span>
            </li>
            <li className="hover:text-blue-600 cursor-pointer flex items-center">
              📂 <span className="ml-2">View Profiles</span>
            </li>
            <li className="hover:text-blue-600 cursor-pointer flex items-center">
              ⚙️ <span className="ml-2">Settings</span>
            </li>
          </ul>
        </aside>

        {/* Upload Section */}
        <main className="flex-1 p-12">
          <div className="bg-white shadow-lg rounded-lg p-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              📄 Create Job Profile
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Upload a Job Description PDF to generate a structured job profile.
            </p>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 mb-6
                         file:mr-4 file:py-3 file:px-6
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />

            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition text-lg"
            >
              Upload
            </button>

            {message && (
              <p
                className={`mt-6 text-base font-medium ${
                  message.startsWith("✅")
                    ? "text-green-600"
                    : message.startsWith("⚠️")
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
