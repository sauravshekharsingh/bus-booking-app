import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import Button from "react-bootstrap/Button";
import { PersonCircle } from "react-bootstrap-icons";

function Header() {
  const { user, isAdmin, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear("token");

    dispatch({ type: "LOGOUT" });

    navigate("/login");
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg={isAdmin ? "dark" : "primary"}
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <Link to="/">
            Bus Booking {user && (isAdmin ? "| Admin" : "| User")}
          </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Navbar.Text style={{ marginRight: "1rem" }}>
              <Link to="/">Home</Link>
            </Navbar.Text>
            {!user && (
              <>
                <Navbar.Text style={{ marginRight: "1rem" }}>
                  <Link to="/login">Login</Link>
                </Navbar.Text>
                <Navbar.Text style={{ marginRight: "1rem" }}>
                  <Link to="/signup">Signup</Link>
                </Navbar.Text>
              </>
            )}

            {user && isAdmin && (
              <>
                <Navbar.Text style={{ marginRight: "1rem" }}>
                  <Link to="/add-bus">Add Bus</Link>
                </Navbar.Text>
                <Navbar.Text style={{ marginRight: "1rem" }}>
                  <Link to="/view-bus">View Bus</Link>
                </Navbar.Text>
              </>
            )}

            {user && !isAdmin && (
              <>
                <Navbar.Text style={{ marginRight: "1rem" }}>
                  <Link to="/booking">Book Tickets</Link>
                </Navbar.Text>
                <Navbar.Text style={{ marginRight: "1rem" }}>
                  <Link to="/booking/view">View Bookings</Link>
                </Navbar.Text>
              </>
            )}
          </Nav>

          <Nav>
            {user && (
              <>
                <Navbar.Text
                  className="d-flex align-items-center"
                  style={{ marginRight: "1rem" }}
                >
                  <PersonCircle className="me-2" /> {user.name} / {user.email}
                </Navbar.Text>
                <Button
                  variant="danger"
                  style={{ marginRight: "1rem", cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
