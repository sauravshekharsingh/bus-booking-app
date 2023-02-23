import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import api from "../utils/api";
import { getAuthTokenFromLocalStorage } from "../utils/token";
import { days, cities } from "../utils/constants";
import Table from "react-bootstrap/esm/Table";
import { PlusCircleFill, XCircleFill } from "react-bootstrap-icons";

function AddBus() {
  const [busName, setBusName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [numOfSeats, setNumOfSeats] = useState(0);
  const [runsOnDays, setRunsOnDays] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [fare, setFare] = useState(0);

  const [busRoute, setBusRoute] = useState([
    { location: cities[0], time: "00:00", fare: 0 },
    { location: cities[0], time: "00:00", fare: 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleDaysChange = (event) => {
    if (event.target.checked) {
      setRunsOnDays([...runsOnDays, event.target.value]);
    } else {
      setRunsOnDays(runsOnDays.filter((day) => day !== event.target.value));
    }
  };

  const handleAddRouteLocation = (event) => {
    setBusRoute([
      busRoute[0],
      { location: cities[0], time: "00:00", fare: 0 },
      ...busRoute.splice(1, busRoute.length),
    ]);
  };

  const handleDeleteRouteLocation = (delIndex) => {
    setBusRoute(
      busRoute.filter((route, index) => {
        return index !== delIndex;
      })
    );
  };

  const handleBusRouteChange = (event, type, index) => {
    setBusRoute(
      busRoute.map((obj, i) => {
        if (index === i) {
          busRoute[index][type] = event.target.value;
        }

        return obj;
      })
    );
  };

  const handleFacilitiesChange = (event) => {
    setFacilities(event.target.value.split(" "));
  };

  const areEmptyInputs = () => {
    if (
      !busName ||
      !contactNumber ||
      !busRoute ||
      !busRoute ||
      !numOfSeats ||
      !runsOnDays ||
      !facilities ||
      !fare
    )
      return true;

    return false;
  };

  const isBusRouteValid = () => {
    const locations = busRoute.map((obj) => obj.location);
    const fares = busRoute.map((obj) => parseInt(obj.fare)).splice(1);

    if (new Set(locations).size !== locations.length) {
      setError("Two of the locations in bus route are same. Please check.");
      return false;
    }

    if (fares.includes(0)) {
      setError("Fare cannot be zero. Please check.");
      return false;
    }

    return true;
  };

  const handleAddBus = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (areEmptyInputs()) {
      setError("Please fill in all the fields");
      setLoading(false);
      return;
    }

    if (!isBusRouteValid()) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(
        "/bus/add",
        {
          busName,
          contactNumber,
          from: busRoute[0].location,
          to: busRoute[busRoute.length - 1].location,
          busRoute: busRoute.map((obj) => obj.location),
          busRouteTimes: busRoute.map((obj) => obj.time),
          busRouteFares: busRoute.map((obj) => obj.fare),
          numOfSeats,
          runsOnDays,
          departure: busRoute[0].time,
          arrival: busRoute[busRoute.length - 1].time,
          facilities,
          fare,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        }
      );

      setSuccess(res.data.message);
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }

    setSuccess("Bus added");
    setLoading(false);
  };

  return (
    <Container className="mt-3 mb-3">
      <Row>
        <h2>Add Bus</h2>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
      </Row>

      <Row>
        <Form>
          <Row>
            <Col className="col-xs-12">
              <Form.Group className="mb-3" controlId="busName">
                <Form.Label>Bus Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter bus name"
                  onChange={(e) => setBusName(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col className="col-xs-12">
              <Form.Group className="mb-3" controlId="contactNumber">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Contact number"
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Stop Location</th>
                  <th>Time</th>
                  <th>Fare from Source</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {busRoute.map((obj, index) => {
                  return (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>
                        <Form.Select
                          onChange={(e) =>
                            handleBusRouteChange(e, "location", index)
                          }
                        >
                          {cities.map((city) => (
                            <option key={city} selected={city === obj.location}>
                              {city}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          defaultValue={obj.time}
                          placeholder="Time at which bus reaches this stop (24-hour format)"
                          onChange={(e) =>
                            handleBusRouteChange(e, "time", index)
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          defaultValue={obj.fare}
                          placeholder="Total fare from source to this stop"
                          onChange={(e) =>
                            handleBusRouteChange(e, "fare", index)
                          }
                          min="0"
                        />
                      </td>
                      <td>
                        {index !== busRoute.length - 1 && (
                          <React.Fragment>
                            {index === 0 && (
                              <PlusCircleFill
                                className="mt-2 text-success"
                                style={{ fontSize: "1.4rem" }}
                                onClick={handleAddRouteLocation}
                              />
                            )}
                            {index !== 0 && (
                              <XCircleFill
                                className="mt-2 text-danger"
                                style={{ fontSize: "1.4rem" }}
                                onClick={() => handleDeleteRouteLocation(index)}
                              />
                            )}
                          </React.Fragment>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Row>

          <Row>
            <Col className="col-xs-12">
              <Form.Group className="mb-3" controlId="numOfSeats">
                <Form.Label>Number of Seats</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Number of seats"
                  min={0}
                  onChange={(e) => setNumOfSeats(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col className="col-xs-12">
              <Form.Group className="mb-3" controlId="runsOnDays">
                <Form.Label>Runs on days</Form.Label>
                <div key={`inline-checkbox`} className="mb-3">
                  {days.map((day) => (
                    <Form.Check
                      inline
                      label={day.substr(0, 3)}
                      value={day}
                      name="runsOnDays"
                      type="checkbox"
                      id={`inline-checkbox-${day}`}
                      key={day}
                      onClick={handleDaysChange}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col className="col-xs-12">
              <Form.Group className="mb-3" controlId="facilities">
                <Form.Label>Facilities</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Facilities seperated by spaces"
                  onChange={(e) => handleFacilitiesChange(e)}
                />
              </Form.Group>
            </Col>
            <Col className="col-xs-12">
              <Form.Group className="mb-3" controlId="fare">
                <Form.Label>Fare</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Fare for full journey"
                  min="0"
                  onChange={(e) => setFare(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            onClick={handleAddBus}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" /> : "Add Bus"}
          </Button>
        </Form>
      </Row>
    </Container>
  );
}

export default AddBus;
