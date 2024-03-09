import React from "react";
import { useState } from "react";
import Layout from "./Layout";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DialogMessage from "./DialogMessage";
import { green } from "@mui/material/colors";

export default function Login({ onMassageChange, redirectTo, api }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [isError, setIsError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    verifyUserDetails(data);
  }

  async function verifyUserDetails(userDetails) {
    const response = await fetch(`${api}Users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    });

    if (response.status === 400) {
      setShowDialog(true);
      setIsError(true);
      setDialogMsg("email or password isn't correct! please try again.");
      return;
    }
    if (response.status === 403) {
      setShowDialog(true);
      setIsError(true);
      setDialogMsg("Unfortunately, your user is not active any more.");
      return;
    }
    if (response.status === 404) {
      setShowDialog(true);
      setIsError(true);
      setDialogMsg("This email isn't register yet! Go to signUp before login.");
      return;
    }
    const currentUser = await response.json();
    delete currentUser.password;
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    setShowDialog(true);
    setIsError(false);
    setDialogMsg("logged in successfully!");
  }

  function handleCloseDialog() {
    setShowDialog(false);
    if (!isError) {
      const userData = JSON.parse(sessionStorage.getItem("currentUser"));
      if (userData.email.trim() === "admin@gmail.com") {
        redirectTo("");
        return;
      }

      onMassageChange(`${userData.firstName}, let's insert an new flat.`);
      redirectTo("flats");
    }
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Layout title="Look a Like Airbnb! ">
      <Paper sx={{ width: "90%", paddingY: 4, margin: "0 auto" }} elevation={3}>
        <Typography
          variant="h4"
          component="h4"
          gutterBottom={true}
          align="center"
        >
          Login
        </Typography>
        {showDialog && (
          <DialogMessage
            openDialog={showDialog}
            closeDialog={handleCloseDialog}
            title={isError ? "Error" : "Good Job"}
            colorMsg={isError ? "error" : green[800]}
            colorBtn={isError ? "error" : "success"}
            closeBtn="Close"
            contentStyle={{ width: "400", margin: "0 auto", spacing: 3 }}
          >
            {dialogMsg}
          </DialogMessage>
        )}
        <Stack textAlign="center" spacing={3}>
          <form onSubmit={handleSubmit}>
            <TextField
              id="email"
              name="email"
              variant="filled"
              label="Email"
              sx={{ width: "80%", margin: "auto" }}
              required={true}
            />
            <FormControl sx={{ m: 1, width: "80%" }} variant="filled">
              <InputLabel htmlFor="password">Password</InputLabel>
              <FilledInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required={true}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Stack
              sx={{ marginY: 2 }}
              direction="row"
              spacing={4}
              justifyContent="center"
            >
              <Button
                variant="contained"
                type="submit"
                sx={{ paddingX: 3, paddingY: 1, marginY: 2 }}
              >
                Sign me in!
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Layout>
  );
}
