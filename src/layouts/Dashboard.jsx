import React, { useState, useEffect } from "react";
import { Api } from "../api";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import Header from "../components/web/Header";
import Sidebar from "../components/web/Sidebar";

const LayoutDashboard = ({ children }) => {
  const [user, setUser] = useState({});
  const history = useHistory();
  const token = Cookies.get("token");

  const fetchData = async () => {
    if (!token) {
      history.push("/login");
      return;
    }

    try {
      const response = await Api.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.email_verified_at === null) {
        history.push("/verify-email");
      } else {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      history.push("/login");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <div className="px-10 mt-14 md:px-24 flex flex-col md:flex-row gap-x-4 items-start">
        <Sidebar />
        {children}
      </div>
    </>
  );
};

export default LayoutDashboard;
