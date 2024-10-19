import { Provider, useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import AuthLayout from "./layout/AuthLayout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import store from "./store";
import AddPodcast from "./pages/AddPodcast";
import { useEffect } from "react";
import axios from "axios";
import { authActions } from "./store/auth";
import ErrorPage from "./pages/ErrorPage"; // Import the ErrorPage component

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Access Redux state to check if logged in

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1573/api/v1/check-cookie",
          {
            withCredentials: true,
          }
        );
        if (res.data.message) {
          dispatch(authActions.loginSuccess());
        }
      } catch (error) {
        console.error("Error fetching cookie data", error);
      }
    };
    fetch();
  }, [dispatch]);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/categories" element={<Categories />} />

            {/* Add the AddPodcast route under MainLayout */}
            <Route path="/add-podcast" element={<AddPodcast />} />

            {/* Profile Route (protected) */}
            <Route
              path="/profile"
              element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
            />
          </Route>

          {/* Auth Routes */}
          <Route path="/" element={<AuthLayout />}>
            {/* If logged in, prevent access to login/signup */}
            <Route
              path="/signup"
              element={isLoggedIn ? <ErrorPage /> : <Signup />}
            />
            <Route
              path="/login"
              element={isLoggedIn ? <ErrorPage /> : <Login />}
            />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
