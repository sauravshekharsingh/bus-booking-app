import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/esm/Spinner";

import api from "../utils/api";
import { getAuthTokenFromLocalStorage } from "../utils/token";
import Table from "react-bootstrap/esm/Table";
import { CurrencyRupee, StarFill } from "react-bootstrap-icons";

export default function AddReviewModal({
  booking,
  showAddReviewModal,
  setShowAddReviewModal,
}) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddReview = async (bookingId) => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!content) {
      setError("Please write some feedback");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(
        `/bus/review/add/${booking.bus._id}`,
        { rating, content },
        {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        }
      );
      const data = res.data;

      setSuccess(data.message);
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }

    setLoading(false);
  };

  return (
    <Modal
      size="xl"
      className="w-100 h-10"
      show={showAddReviewModal}
      onHide={() => setShowAddReviewModal(false)}
      aria-labelledby="example-modal-sizes-title-xl"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-xl">
          Add a Review
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Row>
            <Col>
              <Table>
                <tbody>
                  <tr>
                    <th>Booking Date</th>
                    <td>
                      {new Date(booking.createdAt).toLocaleDateString()}{" "}
                      {new Date(booking.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Bus ID</th>
                    <td>{booking.bus._id}</td>
                  </tr>
                  <tr>
                    <th>Bus Name</th>
                    <td>{booking.bus.busName}</td>
                  </tr>
                  <tr>
                    <th>Journey Date</th>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th>Journey From</th>
                    <td>{booking.from}</td>
                  </tr>
                  <tr>
                    <th>Journey To</th>
                    <td>{booking.to}</td>
                  </tr>
                  <tr>
                    <th>Fare</th>
                    <td>
                      <CurrencyRupee />
                      {booking.fare}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <Form.Group className="mb-4" controlId="reviewContent">
                  <Form.Label className="d-flex align-items-center">
                    <b>Rating stars:</b>
                    {Array.from({ length: rating }, (_, i) => (
                      <StarFill key={i} className="me-1 ms-1" />
                    ))}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter rating stars (min = 0, max = 5)"
                    onChange={(e) => setRating(e.target.value)}
                    min="0"
                    max="5"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="reviewContent">
                  <Form.Label>
                    <b>Write about your experience</b>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Write about your experience"
                    rows={3}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleAddReview}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" /> : "Add Review"}
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
