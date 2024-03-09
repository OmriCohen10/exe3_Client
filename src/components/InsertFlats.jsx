import React, { useEffect } from "react";
import { useState } from "react";
import Layout from "./Layout";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import DialogMessage from "./DialogMessage";
import { green } from "@mui/material/colors";
import Flats from "./Flats";
import { citiesList } from "../utility/collections";
export default function InsertFlats({ redirectTo, message, api }) {
  const [flats, setFlats] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [fetchUsers, setFetchUsers] = useState(false);
  useEffect(() => {
    getFlatsFromServer();
  }, [fetchUsers]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    InsertNewFlat(data);
  }

  async function InsertNewFlat(flatDetails) {
    const response = await fetch(`${api}Flats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flatDetails),
    });
    if (response.status === 400) {
      setDialogMsg("Something went wrong. Please try again.");
      setShowDialog(true);
      setIsError(true);
      return;
    } else if (response.status === 500) {
      setDialogMsg("Internal server error! Please try again later.");
      setShowDialog(true);
      setIsError(true);
      return;
    }
    setDialogMsg(`flat has been inserted sccessfully!`);
    setShowDialog(true);
    setIsError(false);
    setFetchUsers((prev) => !prev);
  }

  async function getFlatsFromServer() {
    const response = await fetch(`${api}Flats`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const flatsFromServer = await response.json();
    setFlats(flatsFromServer);
  }

  function handleCloseDialog() {
    setShowDialog(false);
  }

  return (
    <Layout title="Insert New Flat:">
      <Typography variant="h6">{message}</Typography>
      {showDialog && (
        <DialogMessage
          openDialog={showDialog}
          closeDialog={handleCloseDialog}
          title={isError ? "Error Message" : "Good Job!"}
          colorMsg={isError ? "error" : green[800]}
          colorBtn={isError ? "error" : "success"}
          closeBtn="Close"
          contentStyle={{
            width: "400",
            margin: "0 auto",
            spacing: 4,
          }}
        >
          {dialogMsg}
        </DialogMessage>
      )}
      <Paper sx={{ width: "90%", paddingY: 4, margin: "0 auto" }} elevation={3}>
        <Typography
          variant="h4"
          component="h4"
          gutterBottom={true}
          align="center"
        >
          Enter details:
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack
            direction="column"
            spacing={2}
            sx={{ alignItems: "center", width: "90%", margin: "auto" }}
          >
            <Autocomplete
              options={citiesList}
              freeSolo={true}
              sx={{ width: "80%", margin: "auto" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="city"
                  name="city"
                  label="City"
                  variant="filled"
                  required={true}
                />
              )}
            />
            <TextField
              id="address"
              name="address"
              variant="filled"
              label="Address"
              sx={{ width: "80%", margin: "auto" }}
              inputProps={{ maxLength: 25 }}
              required={true}
            />
            <TextField
              id="price"
              name="price"
              type="number"
              variant="filled"
              label="Price ($)"
              sx={{ width: "80%", margin: "auto" }}
              required={true}
            />
            <TextField
              id="numOfRooms"
              name="numOfRooms"
              type="number"
              variant="filled"
              label="Number of rooms"
              sx={{ width: "80%", margin: "auto" }}
              inputProps={{ min: 1, max: 8 }}
              required={true}
            />
            <Button type="submit" variant="outlined">
              Inset flat!
            </Button>
          </Stack>
        </form>
      </Paper>
      <Flats flatsList={flats} redirectTo={redirectTo} />
    </Layout>
  );
}
