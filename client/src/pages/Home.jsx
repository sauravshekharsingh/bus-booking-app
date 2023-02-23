import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import busStopImage from "../assets/busstop.png";

function Home() {
  return (
    <Container>
      <Row className="mt-4">
        <Col className="col-12 col-lg-6 d-flex flex-column justify-content-center">
          <h1>Bus Booking System</h1>
          <h4>Book tickets at your fingertips. Hassle free.</h4>
        </Col>
        <Col className="col-12 col-lg-6">
          <img src={busStopImage} alt="Bus Stop" className="w-100"></img>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
