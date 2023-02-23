import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import api from "../utils/api";
import { getAuthTokenFromLocalStorage } from "../utils/token";
import useAuthContext from "../hooks/useAuthContext";
import { CurrencyRupee } from "react-bootstrap-icons";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/esm/Button";
import AddReviewModal from "./AddReviewModal";
import { getInvoiceDefinition } from "../utils/invoice";

function ViewBookings() {
  const { user } = useAuthContext();

  const [bookings, setBookings] = useState([]);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBuses() {
      setLoading(true);
      try {
        const res = await api.get(`/booking/user/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        });
        const data = res.data;

        setBookings(data.data.bookings);
        setSuccess(data.message);
      } catch (err) {
        console.log(err);
        setError(err.response.data.message);
      }
      setLoading(false);
    }

    fetchBuses();
  }, [user?.id]);

  const handleCancelBooking = async (bookingId) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.patch(
        `/booking/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        }
      );
      const data = res.data;

      setSuccess(data.message);
      setBookings([
        ...bookings.filter((booking) => booking._id !== bookingId),
        data.data.booking,
      ]);
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }

    setLoading(false);
  };

  const handleAddReviewClick = (index) => {
    setShowAddReviewModal(true);
    setBooking(bookings[index]);
  };

  const handleGenerateInvoice = (booking) => {
    window.pdfMake.createPdf(getInvoiceDefinition(user, booking)).open();
  };

  return (
    <React.Fragment>
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
                  <th>Bus Name</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Date</th>
                  <th>Seat Numbers</th>
                  <th>Fare</th>
                  <th>Booking Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map((booking, index) => (
                  <tr key={booking._id}>
                    <td>{index + 1}</td>
                    <td>{booking.bus.busName}</td>
                    <td>{booking.from}</td>
                    <td>{booking.to}</td>
                    <td>
                      {new Date(booking.date).toLocaleDateString("en-US")}
                    </td>
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
                    <td>
                      {new Date(booking.createdAt).toLocaleString("en-US")}
                    </td>
                    <td>
                      {booking.cancelled ? (
                        <Badge bg="danger" className="me-1 ms-1">
                          Cancelled
                        </Badge>
                      ) : (
                        <Badge bg="success" className="me-1 ms-1">
                          Booked
                        </Badge>
                      )}
                      {new Date(booking.date) < new Date() && (
                        <Badge bg="secondary" className="me-1 ms-1">
                          Travel date passed
                        </Badge>
                      )}
                    </td>
                    <td>
                      <Button
                        className="mb-1 me-1"
                        size="sm"
                        variant="primary"
                        onClick={() => handleGenerateInvoice(booking)}
                      >
                        Invoice
                      </Button>
                      <Button
                        className="mb-1 me-1"
                        size="sm"
                        variant="success"
                        onClick={() => handleAddReviewClick(index)}
                      >
                        Add review
                      </Button>
                      {!booking.cancelled && (new Date(booking.date) > new Date()) && (
                        <Button
                          className="mb-1"
                          size="sm"
                          variant="danger"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Row>
      </Container>
      {showAddReviewModal && (
        <AddReviewModal
          booking={booking}
          showAddReviewModal={showAddReviewModal}
          setShowAddReviewModal={setShowAddReviewModal}
        />
      )}
    </React.Fragment>
  );
}

export default ViewBookings;
