import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

export default function Home() {
  return (
    <>
      <Header />
      <main className="home-main">
        <div className="home-content">
          <h1>Welcome to Student-Teacher Slot Booking System</h1>
          <p>
            Easily book slots with teachers or manage your schedule as a teacher.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
