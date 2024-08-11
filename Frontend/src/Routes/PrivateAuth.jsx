import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function PrivateRoute({ children }) {
    const { status } = useSelector((state) => state.auth);

    return status ? children : <Navigate to={"/"} />
}

export default PrivateRoute