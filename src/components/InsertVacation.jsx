import React from "react";
import { useState } from "react";
import Layout from "./Layout";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogMessage from "./DialogMessage";
import { green } from "@mui/material/colors";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { calcDateDifference } from "../utility/functions";
import Vacations from "./Vacations";

export default function InsertVacation({api}) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [vacations, setVacations] = useState([]);
  const [showVacations, setShowVacations] = useState(false);

  const flat = JSON.parse(sessionStorage.getItem("flat"));
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.flatId = flat.id;
    data.userEmail = currentUser.email;
    const datesDifference = calcDateDifference(data.startDate, data.endDate);
    if (data.startDate === "" || data.endDate === "") {
      setDialogMsg(
        "Please make sure that your arrival date and leaving date are correct."
      );
      setIsError(true);
      setShowDialog(true);
      return;
    }
    if (!(data.endDate > data.startDate) || datesDifference > 20) {
      setDialogMsg(
        "Please check your dates! Make sure the leaving date is after arrival date, and duration is within 20 days."
      );
      setIsError(true);
      setShowDialog(true);
      return;
    }
    console.log(data);
    InsertNewVacation(data);
  }

  async function InsertNewVacation(vacation) {
    const response = await fetch(`${api}Vacations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vacation),
    });
    switch (response.status) {
      case 400: {
        setDialogMsg(`${await response.text()}`);
        setShowDialog(true);
        setIsError(true);
        break;
      }
      case 404: {
        setDialogMsg(`${await response.text()}`);
        setShowDialog(true);
        setIsError(true);
        break;
      }
      case 500: {
        setDialogMsg("Internal server error! Please try again later.");
        setShowDialog(true);
        setIsError(true);
        break;
      }
      default: {
        setDialogMsg("You just enter an new vacation to your vacations list!");
        setShowDialog(true);
        setIsError(false);
        break;
      }
    }
  }

  async function ShowUserVacations() {
    const response = await fetch(
      `${api}Vacations/userVacations?userEmail=${`${currentUser.email}`}`,
      {
        method: "GET",
        headers: { "Content-Type": "text/plain" },
      }
    );
    const vacationsFromServer = await response.json();
    setVacations(vacationsFromServer);
    setShowVacations(true);
  }

  function handleCloseDialog() {
    setShowDialog(false);
  }

  return (
    <Layout title="Order Your Vacation:">
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
            <TextField
              id="flatId"
              name="flatId"
              variant="filled"
              label="Flat number"
              value={flat.id}
              sx={{ width: "80%", margin: "auto" }}
              inputProps={{ maxLength: 25 }}
              disabled={true}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="startDate"
                name="startDate"
                label="Arrival Date"
                sx={{ width: "80%", margin: "auto" }}
                disablePast={true}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="endDate"
                name="endDate"
                label="Leaving Date"
                sx={{ width: "80%", margin: "auto" }}
                disablePast={true}
              />
            </LocalizationProvider>
            <Stack direction="row" spacing={3}>
              <Button type="submit" variant="contained">
                Order Vacation!
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={ShowUserVacations}
              >
                my vacations!
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
      {showVacations && <Vacations vacationsList={vacations} />}
    </Layout>
  );
}
