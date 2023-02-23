import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import {
  ArrowRightCircleFill,
  Clock,
  CreditCard,
  CurrencyRupee,
} from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/esm/Spinner";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import api from "../utils/api";
import { formatDate } from "../utils/datetime";
import { getAuthTokenFromLocalStorage } from "../utils/token";
import { useNavigate } from "react-router-dom";

export default function BookModal({
  bus,
  from,
  to,
  date,
  showBookModal,
  setShowBookModal,
  seatsBooked,
  setSeatsBooked,
}) {
  const [fare, setFare] = useState(bus.fare);
  const [seatsSelected, setSeatsSelected] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeApplied, setCouponCodeApplied] = useState(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [clientSecret, setClientSecret] = useState(null);
  const elements = useElements();
  const stripe = useStripe();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchClientSecret() {
      setLoading(true);
      try {
        if(fare <= 0) {
          return;
        }

        const res = await api.post(
          "/payment/create",
          { amount: fare },
          {
            headers: {
              Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
            },
          }
        );
        const data = res.data;

        setClientSecret(data.data.clientSecret);
        // setSuccess(data.message);
      } catch (err) {
        console.log(err);
        // setError(err.response.data.message);
      }
      setLoading(false);
    }

    if (couponCodeApplied && seatsSelected.length > 0) {
      if (couponCodeApplied.type === "percentage") {
        setFare(
          bus.fare * seatsSelected.length -
            bus.fare * seatsSelected.length * (couponCodeApplied.value / 100)
        );
      } else if (couponCodeApplied.type === "amount") {
        setFare(bus.fare * seatsSelected.length - couponCodeApplied.value);
      }

      return;
    } else {
      setFare(bus.fare * seatsSelected.length);
    }

    fetchClientSecret();
  }, [fare, seatsSelected, bus.fare, couponCodeApplied]);

  const handleSeatsSelected = (event) => {
    if (event.target.checked) {
      setSeatsSelected([...seatsSelected, parseInt(event.target.value)]);
    } else {
      setSeatsSelected(
        seatsSelected.filter((seat) => seat !== parseInt(event.target.value))
      );
    }
  };

  const handleApplyCoupon = async (event) => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (couponCodeApplied) {
      setError("Coupon code already applied.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(
        "/coupon",
        { code: couponCode },
        {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        }
      );
      const data = res.data;

      if (data.data.coupon.type === "percentage") {
        setCouponCodeApplied(data.data.coupon);
        setSuccess(
          `Coupon '${couponCode}' successfully applied. You can avail ${data.data.coupon.value}% discount.`
        );
      } else {
        setCouponCodeApplied(data.data.coupon);
        setSuccess(
          `Coupon '${couponCode}' successfully applied. You can avail INR ${data.data.coupon.value} discount.`
        );
      }
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }

    setLoading(false);
  };

  const handleBookSeats = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (seatsSelected.length === 0) {
      setError("Please select atleast one seat to book");
      setLoading(false);
      return;
    }

    try {
      const paymentRes = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentRes.hasOwnProperty("error")) {
        throw new Error(paymentRes.error.message);
      }

      const res = await api.post(
        "/booking/create",
        {
          busId: bus._id,
          from,
          to,
          date,
          seatNumbers: seatsSelected,
          fare,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        }
      );
      const data = res.data;

      setSuccess(`Payment completed. ${data.message}`);
      setSeatsBooked([...seatsBooked, ...seatsSelected]);

      navigate('/booking/view')
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message ?? err.message);
    }

    setLoading(false);
  };

  return (
    <Modal
      size="xl"
      className="w-100"
      show={showBookModal}
      onHide={() => setShowBookModal(false)}
      aria-labelledby="example-modal-sizes-title-xl"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-xl">
          Book your seats
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Row>
            <Col className="col-lg-7">
              <Table responsive>
                <tbody>
                  {[...Array(Math.ceil(bus.numOfSeats / 6)).keys()].map(
                    (ele, idx1) => (
                      <tr key={idx1}>
                        {[...Array(6).keys()].map((ele, idx2) => {
                          return (
                            <td key={idx2}>
                              {6 * idx1 + idx2 + 1 <= bus.numOfSeats && (
                                <Form.Check
                                  inline
                                  label={6 * idx1 + idx2 + 1}
                                  value={6 * idx1 + idx2 + 1}
                                  name="seatNumber"
                                  type="checkbox"
                                  id={`inline-checkbox-${6 * idx1 + idx2 + 1}`}
                                  key={6 * idx1 + idx2 + 1}
                                  disabled={seatsBooked.includes(
                                    6 * idx1 + idx2 + 1
                                  )}
                                  onChange={handleSeatsSelected}
                                  style={{
                                    color: seatsBooked.includes(
                                      6 * idx1 + idx2 + 1
                                    )
                                      ? "red"
                                      : "",
                                    fontWeight: seatsBooked.includes(
                                      6 * idx1 + idx2 + 1
                                    )
                                      ? "600"
                                      : "",
                                  }}
                                />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </Col>

            <Col className="col-lg-5 mt-4">
              <Form>
                <p className="h3 d-flex align-items-center mb-4">
                  {from} <ArrowRightCircleFill className="me-2 ms-2" /> {to}
                </p>

                <p className="h6 d-flex align-items-center mb-4 mt-4">
                  <Clock className="me-2" />
                  Departure: {formatDate(date)} {bus.departure.substr(11, 5)}{" "}
                  from {bus.from}
                </p>

                <p className="h6 d-flex align-items-center mb-4 mt-4">
                  <Clock className="me-2" />
                  Arrival: {formatDate(date)} {bus.arrival.substr(11, 5)} at{" "}
                  {bus.to}
                </p>

                <p className="h6 d-flex align-items-center mb-4 mt-4">
                  Fare:
                  <CurrencyRupee className="me-2 ms-2" />
                  {fare}
                </p>

                <p className="h6">
                  Seats left: {bus.numOfSeats - seatsBooked.length} /{" "}
                  {bus.numOfSeats}
                </p>

                <Form.Group className="mb-4 mt-4" controlId="couponCode">
                  <Form.Label>
                    <b>Have a coupon code? Redeem here.</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter coupon code"
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button
                    variant="success"
                    className="w-100 mt-2"
                    onClick={handleApplyCoupon}
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" /> : "Apply Coupon"}
                  </Button>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="mb-4 d-flex align-items-center">
                    <CreditCard className="me-2" />
                    Card Details
                  </Form.Label>
                  <CardElement />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                  onClick={handleBookSeats}
                >
                  {loading ? <Spinner animation="border" /> : "Book Seats"}
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
