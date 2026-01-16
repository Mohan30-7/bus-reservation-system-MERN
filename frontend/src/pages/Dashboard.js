import React, { useEffect, useState } from "react";
function Dashboard() {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [seats, setSeats] = useState("");
    const [bookings, setBookings] = useState([]);
    const [openFaq, setOpenFaq] = useState(null);
    const user = localStorage.getItem("mvBusUser");
    const driverMap = { 1: "Murugan", 2: "Rajendran", 3: "Velu", 4: "Mani" };
    useEffect(() => {
        if (!user) { window.location.href = "/"; }
        loadBuses();
    }, []);
    const loadBuses = async () => {
        const res = await fetch("http://127.0.0.1:5000/api/buses");
        const data = await res.json();
        setBuses(data);
    };
    const loadBookings = async () => {
        const res = await fetch(`http://127.0.0.1:5000/api/my-bookings/${user}`);
        const data = await res.json();
        setBookings(data);
    };
    const bookBus = async e => {
        e.preventDefault();
        if (!selectedBus || !seats) { alert("Please select bus and seats"); return; }
        await fetch("http://127.0.0.1:5000/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ busId: selectedBus._id, customerName: user, seats: Number(seats) }) });
        alert("🎉 Booking successful!");
        setSeats("");
        setSelectedBus(null);
        loadBuses();
    };
    const logout = () => {
        localStorage.removeItem("mvBusUser");
        window.location.href = "/";
    };
    return (
        <>
            <header className="top-nav">
                <div className="nav-left">
                    <span className="brand">🚌 MV Bus</span>
                </div>
                <div className="nav-right">
                    <button className="nav-link">Home</button>
                    <button className="nav-link">About Us</button>
                    <button className="nav-link" onClick={logout}>🚪 Logout ({user})</button>
                </div>
            </header>
            <section className="bus-strip">
                {buses.slice(0, 4).map(bus => (
                    <div className="bus-card" key={bus._id}>
                        <div className={`bus-photo bus${bus.busNumber}`}></div>
                        <h3>BUS NO: {bus.busNumber}</h3>
                        <p><strong>Route:</strong> {bus.route}</p>
                        <p><strong>Driver:</strong> {driverMap[bus.busNumber]}</p>
                        <p><strong>Time:</strong> {bus.departureTime}</p>
                    </div>
                ))}
            </section>
            <div className="container">
                <section>
                    <h2>Available Buses</h2>
                    <table id="bus-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Route</th>
                                <th>Departure</th>
                                <th>Price</th>
                                <th>Seats</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buses.map(bus => (
                                <tr key={bus._id}>
                                    <td>{bus.busNumber}</td>
                                    <td>{bus.route}</td>
                                    <td>{bus.departureTime}</td>
                                    <td>₹{bus.price}</td>
                                    <td>{bus.availableSeats}</td>
                                    <td>
                                        <button className="select-btn" onClick={() => setSelectedBus(bus)}>Select</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <section>
                    <h2>Book Seats</h2>
                    <form id="booking-form" onSubmit={bookBus}>
                        <p>Selected Bus: {selectedBus ? `${selectedBus.route} (${selectedBus.departureTime})` : "None"}</p>
                        <input type="number" min="1" placeholder="Number of Seats" value={seats} onChange={e => setSeats(e.target.value)} />
                        <button type="submit">Book Now</button>
                    </form>
                </section>
                <section id="booking-list-section">
                    <h2>All Bookings</h2>
                    <button id="load-bookings-btn" onClick={loadBookings}>📋 Load Bookings</button>
                    <ul id="booking-list">
                        {bookings.length === 0 && <li>No bookings found</li>}
                        {bookings.map(b => (
                            <li key={b._id}>
                                {b.bus ? `${b.bus.route} – ${b.seatsBooked} seats` : `Old booking (${b.seatsBooked} seats) – Bus details unavailable`}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
            <section className="faq-section">
                <div className="faq-container">
                    <h2>❓ FAQs</h2>
                    {[
                        { q: "How do I book a bus ticket?", a: "Select a bus, enter seats and click Book Now." },
                        { q: "Can I cancel my booking?", a: "Cancellation is allowed up to 2 hours before departure." },
                        { q: "Is payment secure?", a: "Yes, all payments are encrypted." },
                        { q: "How to see my bookings?", a: "Click the Load Bookings button." }
                    ].map((faq, i) => (
                        <div key={i} className={`faq-item ${openFaq === i ? "active" : ""}`}>
                            <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>{faq.q}<span>▼</span></div>
                            <div className="faq-answer">{faq.a}</div>
                        </div>
                    ))}
                </div>
            </section>
            <footer className="site-footer">
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>About MV Bus</h4>
                        <p>Contact us</p>
                        <p>Sitemap</p>
                        <p>Offers</p>
                        <p>Careers</p>
                    </div>
                    <div className="footer-column">
                        <h4>Info</h4>
                        <p>T&C</p>
                        <p>Privacy policy</p>
                        <p>Blog</p>
                        <p>Bus Timetable</p>
                    </div>
                    <div className="footer-column">
                        <h4>Global Sites</h4>
                        <p>India</p>
                        <p>Singapore</p>
                        <p>Malaysia</p>
                        <p>Indonesia</p>
                    </div>
                    <div className="footer-column">
                        <h4>Our Partners</h4>
                        <p>Goibibo</p>
                        <p>Makemytrip</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 MV Bus Pvt Ltd. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
export default Dashboard;
