import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { getAuthTokenFromLocalStorage } from "../utils/token";
import Col from "react-bootstrap/esm/Col";
import { StarFill } from "react-bootstrap-icons";

function Reviews({ buses, busId, showReviews, setShowReviews }) {
  const [bus, setBus] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setBus(buses.filter((bus) => bus._id === busId)[0]);
    setReviews(buses.filter((bus) => bus._id === busId)[0].reviews);
  }, [buses, busId]);

  return (
    <Modal
      size="xl"
      className="w-100 h-10"
      show={showReviews}
      onHide={() => setShowReviews(false)}
      aria-labelledby="example-modal-sizes-title-xl"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-xl">Reviews</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Table>
              <tbody>
                <tr>
                  <th>Bus ID</th>
                  <td>{bus?._id}</td>
                </tr>
                <tr>
                  <th>Bus Name</th>
                  <td>{bus?.busName}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Rating</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, index) => (
                  <tr key={review._id}>
                    <td>{index + 1}</td>
                    <td>
                      <Row>
                        <Col>
                          {Array.from({ length: review.rating }, (_, i) => (
                            <StarFill key={i} className="me-1" />
                          ))}
                        </Col>
                        <Col>{review.rating} / 5</Col>
                      </Row>
                    </td>
                    <td>{review.content}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

function ViewBus() {
  const [buses, setBuses] = useState([]);
  const [reviewBusId, setReviewBusId] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBuses() {
      setLoading(true);
      try {
        const res = await api.get("/bus", {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        });
        const data = res.data;

        setBuses(data.data.buses);
        setSuccess(data.message);
      } catch (err) {
        setError(err.response.data.message);
      }
      setLoading(false);
    }

    fetchBuses();
  }, []);

  return (
    <Container className="mt-3 mb-3">
      <Row>
        <h2>View Buses</h2>
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
                <th>Route</th>
                <th>Num of seats</th>
                <th>Runs on days</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Facilities</th>
                <th>Fare</th>
                <th>Bookings</th>
                <th>Reviews</th>
              </tr>
            </thead>
            <tbody>
              {buses?.map((bus, index) => (
                <tr key={bus._id}>
                  <td>{index + 1}</td>
                  <td>{bus.busName}</td>
                  <td>{bus.from}</td>
                  <td>{bus.to}</td>
                  <td>{bus.busRoute.map((loc) => `${loc}, `)}</td>
                  <td>{bus.numOfSeats}</td>
                  <td>
                    {bus.runsOnDays.map((day) => `${day.substr(0, 3)}, `)}
                  </td>
                  <td>
                    {`${new Date(bus.departure).getHours()}:${new Date(
                      bus.departure
                    ).getMinutes()}`}
                  </td>
                  <td>
                    {`${new Date(bus.arrival).getHours()}:${new Date(
                      bus.arrival
                    ).getMinutes()}`}
                  </td>
                  <td>{bus.facilities.map((facility) => `${facility}, `)}</td>
                  <td>{bus.fare}</td>
                  <td>
                    <Link to={`/booking/${bus._id}`} className="m-2">
                      <Button size="sm">View ({bus.bookings.length})</Button>
                    </Link>
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setShowReviews(true);
                        setReviewBusId(bus._id);
                      }}
                    >
                      Reviews ({bus.reviews.length})
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Row>
      {showReviews && (
        <Reviews
          busId={reviewBusId}
          buses={buses}
          showReviews={showReviews}
          setShowReviews={setShowReviews}
        />
      )}
    </Container>
  );
}

export default ViewBus;
