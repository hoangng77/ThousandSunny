import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import PropTypes from "prop-types";

export default function PrivateRoute({ children }) {
    const { user } = useContext(AuthContext);
    return user ?  children : <Navigate to="/login" />;
}
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}