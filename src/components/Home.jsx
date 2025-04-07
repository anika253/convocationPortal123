import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to ConvPortal</h1>
      <Link to="/login">
        <button>Admin Login</button>
      </Link>
    </div>
  );
};

export default Home;
