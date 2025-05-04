import React from "react";

// Import component Header dan Footer
import Header from "../components/web/Header";
import Footer from "../components/web/Footer";

const LayoutWeb = ({ children }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default LayoutWeb;
