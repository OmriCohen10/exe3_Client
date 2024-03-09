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

export default function SignUp({ redirectTo, onMassageChange, api }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [isError, setIsError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    SignUpNewUser(data);
  }

  async function SignUpNewUser(userDetails) {
    const response = await fetch(`${api}Users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    });

    if (response.status === 400) {
      setDialogMsg("Email is already registered! Please try another else.");
      setShowDialog(true);
      setIsError(true);
      return;
    } else if (response.status === 500) {
      setDialogMsg("Internal server error! Please try again later.");
      setShowDialog(true);
      setIsError(true);
      return;
    }

    const currentUser = await response.json();
    delete currentUser.password;
    setDialogMsg(
      `Thank you ${currentUser.firstName}, now you can go to your next vacation with us.`
    );
    setShowDialog(true);
    setIsError(false);
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  function handleCloseDialog() {
    setShowDialog(false);
    if (!isError) {
      const userData = JSON.parse(sessionStorage.getItem("currentUser"));
      onMassageChange(`${userData.firstName}, let's insert an new flat.`);
      redirectTo("flats");
    }
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <>
      {showDialog && (
        <DialogMessage
          openDialog={showDialog}
          closeDialog={handleCloseDialog}
          title={isError ? "Error Message" : "Good Job"}
          colorMsg={isError ? "error" : green[800]}
          colorBtn={isError ? "error" : "success"}
          closeBtn="Close"
          contentStyle={{ width: "400", margin: "0 auto", spacing: 3 }}
        >
          {dialogMsg}
        </DialogMessage>
      )}
      <Layout title=" Become our member">
        <Paper
          sx={{ width: "90%", paddingY: 4, margin: "0 auto" }}
          elevation={3}
        >
          <Typography
            variant="h4"
            component="h4"
            gutterBottom={true}
            align="center"
          >
            Register now
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack
              direction="column"
              spacing={2}
              sx={{ alignItems: "center", width: "90%", margin: "auto" }}
            >
              <TextField
                id="firstName"
                name="firstName"
                variant="filled"
                label="First Name"
                sx={{ width: "80%", margin: "auto" }}
                required={true}
              />
              <TextField
                id="lastName"
                name="lastName"
                variant="filled"
                label="Last Name"
                sx={{ width: "80%", margin: "auto" }}
                required={true}
              />
              <TextField
                id="email"
                name="email"
                type="email"
                variant="filled"
                label="Email"
                sx={{ width: "80%", margin: "auto" }}
                required={true}
              />
              <FormControl
                sx={{ m: 1, width: "80%" }}
                variant="filled"
                required={true}
              >
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

              <Button
                type="submit"
                variant="contained"
                sx={{ paddingX: 3, paddingY: 1, marginY: 2 }}
              >
                SignUp!
              </Button>
            </Stack>
          </form>
        </Paper>
      </Layout>
    </>
  );
}
