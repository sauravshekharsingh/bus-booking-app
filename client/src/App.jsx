import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddBus from "./pages/AddBus";
import useAuthContext from "./hooks/useAuthContext";
import ViewBus from "./pages/ViewBus";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import ViewBookings from "./pages/ViewBookings";
import ViewBusBookings from "./pages/ViewBusBookings";
import SearchTickets from "./pages/SearchTickets";

function App() {
  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/add-bus" element={<AddBus />} />
          <Route path="/view-bus" element={<ViewBus />} />
          <Route path="/booking/:busId" element={<ViewBusBookings />} />
        </Route>
        <Route element={<ProtectedUserRoute />}>
          <Route path="/booking" element={<SearchTickets />} />
          <Route path="/booking/view" element={<ViewBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
