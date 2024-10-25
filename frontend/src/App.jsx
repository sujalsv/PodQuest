import { Provider, useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import AllPodcasts from "./pages/AllPodcasts";
import Profile from "./pages/Profile";
import store from "./store";
import AddPodcast from "./pages/AddPodcast";
import { useEffect } from "react";
import axios from "axios";
import { authActions } from "./store/auth";
import ErrorPage from "./pages/ErrorPage";
import CategoriesPage from "./pages/CategoriesPage";
import DescriptionPage from "./pages/DescriptionPage";

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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
            <Route path="/add-podcast" element={<AddPodcast />} />
            <Route path="/all-podcasts" element={<AllPodcasts />} />
            <Route
              path="/categories/:categoryName"
              element={<CategoriesPage />}
            />
            <Route path="/description/:id" element={<DescriptionPage />} />
            <Route
              path="/profile"
              element={isLoggedIn ? <Profile /> : <Navigate to="/" />}
            />
          </Route>
          {/* Auth Routes */}
          <Route path="/">
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
