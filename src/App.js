import "./App.css";
import Container from "@mui/material/Container";
import SignUp from "./components/SignUp";
import InsertFlats from "./components/InsertFlats";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import InsertVacation from "./components/InsertVacation";
import Admin from "./components/Admin";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from "@mui/icons-material/Home";
function App() {
  const [api, setApi] = useState("");
  useEffect(() => {
    sessionStorage.setItem("currentUser", JSON.stringify({}));
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    )
      setApi("https://localhost:44343/api/");
    else setApi("https://proj.ruppin.ac.il/cgroup70/test2/tar1/api/");
  }, []);

  const [route, setRoute] = useState("login");
  const [message, setMessage] = useState("");
  function handleRouteChange(route) {
    setRoute(route);
  }

  function handleCurrentMessage(currentMsg) {
    setMessage(currentMsg);
  }

  const loginNavConfig = [
    { value: "Signup", route: "signup", icon: <PersonAddIcon /> },
  ];
  const backNavConfig = [
    { value: "back", route: "login", icon: <ArrowBackIcon /> },
  ];
  const insertVacationsNavConfig = [
    { value: "back", route: "flats", icon: <ArrowBackIcon /> },
    { value: "home", route: "login", icon: <HomeIcon /> },
  ];
  return (
    <Container
      sx={{
        position: "relative",
        top: 20,
      }}
      maxWidth="md"
    >
      {route === "login" ? (
        <>
          <Navigation
            updateRoute={handleRouteChange}
            configuration={loginNavConfig}
          />
          <Login
            onMassageChange={handleCurrentMessage}
            redirectTo={handleRouteChange}
            api={api}
          />
        </>
      ) : route === "flats" ? (
        <>
          <Navigation
            updateRoute={handleRouteChange}
            configuration={backNavConfig}
          />
          <InsertFlats
            redirectTo={handleRouteChange}
            message={message}
            api={api}
          />
        </>
      ) : route === "signup" ? (
        <>
          <Navigation
            updateRoute={handleRouteChange}
            configuration={backNavConfig}
          />
          <SignUp
            redirectTo={handleRouteChange}
            onMassageChange={handleCurrentMessage}
            api={api}
          />
        </>
      ) : route === "vacations" ? (
        <>
          <Navigation
            configuration={insertVacationsNavConfig}
            updateRoute={handleRouteChange}
          />
          <InsertVacation api={api} />
        </>
      ) : (
        <>
          <Navigation
            updateRoute={handleRouteChange}
            configuration={backNavConfig}
          />
          <Admin api={api} />
        </>
      )}
    </Container>
  );
}

export default App;
