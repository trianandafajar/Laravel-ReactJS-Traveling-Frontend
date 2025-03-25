import React, { useEffect } from "react";
import LayoutAdmin from "../../layouts/Dashboard";

function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard | Admin"; // Set title halaman
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <LayoutAdmin>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di halaman Dashboard.</p>
      </div>
    </LayoutAdmin>
  );
}

export default Dashboard;
