import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import api from "../utils/api";
import { getAuthTokenFromLocalStorage } from "../utils/token";
import { cities, filters, sorters } from "../utils/constants";
import { BusFront, Calendar2Date, Search } from "react-bootstrap-icons";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SearchResultCard from "./SearchResultCard";
import SearchResultsFilter from "./SearchResultsFilter";
const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function SearchTickets() {
  const [from, setFrom] = useState(cities[0]);
  const [to, setTo] = useState(cities[0]);
  const [date, setDate] = useState("");
  const [boarding, setBoarding] = useState(cities[0]);
  const [deboarding, setDeboarding] = useState(cities[0]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [buses, setBuses] = useState([]);
  const [filterOptions, setFilterOptions] = useState(filters);
  const [sortOptions, setSortOptions] = useState(sorters);

  const areEmptyInputs = () => {
    if (!from || !to || !date) return true;

    return false;
  };

  const handleSearchTickets = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    if (areEmptyInputs()) {
      setError("Please fill in all the fields");
      setLoading(false);
      return;
    }

    if (from === to) {
      setError("From and To locations cannot be the same.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(
        "/booking/search",
        {
          from,
          to,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        }
      );
      const data = res.data;

      setBuses(data.data.buses);
      setSuccess(data.message);
      setBoarding(from);
      setDeboarding(to);
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }

    setLoading(false);

    setTimeout(() => {
      setSuccess("");
    }, 1000);
  };

  return (
    <Container className="mt-3">
      <Row>
        <h2>Book Tickets</h2>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
      </Row>

      <Row className="mt-2 mb-2">
        <Card className="p-4">
          <Form>
            <Row>
              <Col className="col-6 col-sm-3 mb-2">
                <Form.Group controlId="from">
                  <Form.Label>
                    <b>
                      <BusFront /> From
                    </b>
                  </Form.Label>
                  <Form.Select onChange={(e) => setFrom(e.target.value)}>
                    {cities.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col className="col-6 col-sm-3 mb-2">
                <Form.Group controlId="to">
                  <Form.Label>
                    <b>
                      <BusFront /> To
                    </b>
                  </Form.Label>
                  <Form.Select onChange={(e) => setTo(e.target.value)}>
                    {cities.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col className="col-12 col-sm-3 mb-4">
                <Form.Group controlId="date">
                  <Form.Label>
                    <b>
                      <Calendar2Date /> Date
                    </b>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>

              <Col className="col-12 col-sm-3 mb-4 d-flex align-items-center">
                <Button
                  variant="success"
                  type="submit"
                  className="w-100 mt-auto d-flex align-items-center justify-content-center"
                  onClick={handleSearchTickets}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" />
                  ) : (
                    <>
                      <Search className="me-2" />
                      Search Tickets
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Row>

      <Row className="mt-4">
        <Col className="d-flex align-items-center">
          <Search className="h5 me-2" />
          <p className="h4">Search Results</p>
        </Col>
      </Row>

      <SearchResultsFilter
        buses={buses}
        setBuses={setBuses}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        sortOptions={sortOptions}
        setSortOptions={setSortOptions}
      />

      <Row className="mt-2">
        <Elements stripe={promise}>
          {buses.length > 0 ? (
            buses.map((bus, index) => {
              if (
                filterOptions.some((filter) => bus.facilities.includes(filter))
              ) {
                return (
                  <SearchResultCard
                    key={bus._id}
                    bus={bus}
                    index={index}
                    boarding={boarding}
                    deboarding={deboarding}
                    date={date}
                  />
                );
              }

              return null;
            })
          ) : (
            <Col className="mt-4 text-center">
              <p className="h4">Nothing to display.</p>
            </Col>
          )}
        </Elements>
      </Row>
    </Container>
  );
}

export default SearchTickets;
