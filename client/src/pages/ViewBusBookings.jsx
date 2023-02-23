import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import api from "../utils/api";
import { getAuthTokenFromLocalStorage } from "../utils/token";
import { CurrencyRupee } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";

function ViewBusBookings() {
  const { busId } = useParams();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBuses() {
      setLoading(true);
      try {
        const res = await api.get(`/booking/bus/${busId}`, {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        });
        const data = res.data;

        setBookings(data.data.bookings);
        setSuccess(data.message);
      } catch (err) {
        setError(err.response.data.message);
      }
      setLoading(false);
    }

    fetchBuses();
  }, [busId]);

  return (
    <Container className="mt-3 mb-3">
      <Row>
        <h2>Transactions & Bookings</h2>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
      </Row>

      <Row>
        {loading && <Spinner animation="border" />}
        {!loading && (
          <Table striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
                <th>Seat Numbers</th>
                <th>Fare</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{index + 1}</td>
                  <td>{booking.from}</td>
                  <td>{booking.to}</td>
                  <td>{new Date(booking.date).toLocaleDateString("en-US")}</td>
                  <td>
                    {booking.seatNumbers.map((seatNumber, index) => {
                      return index !== booking.seatNumbers.length - 1
                        ? `${seatNumber}, `
                        : `${seatNumber}`;
                    })}
                  </td>
                  <td>
                    <CurrencyRupee />
                    {booking.fare}
                  </td>
                  <td>{new Date(booking.createdAt).toLocaleString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Row>
    </Container>
  );
}

export default ViewBusBookings;
