import "../App.css";
import heroImage from "../assets/hero.jpg"; // Use the image you downloaded

export default function Home() {
  return (
    <div className="home-page">
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-text">
          <h1>Welcome to Student-Teacher Slot Booking</h1>
          <p>Book your slots or manage your teaching schedule easily.</p>
        </div>
      </div>
    </div>
  );
}
