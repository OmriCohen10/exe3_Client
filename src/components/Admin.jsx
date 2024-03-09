import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Layout from "./Layout";
import DialogMessage from "./DialogMessage";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { green } from "@mui/material/colors";
import DropDown from "./DropDown";
import AvgPriceTable from "./AvgPriceTable";

export default function Admin({ api }) {
  const [isManage, setIsManage] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [isAverage, setIsAverage] = useState(false);
  const [avgPriceList, setAvgPriceList] = useState([]);

  useEffect(() => {
    fetchUsersFromDb();
  }, []);

  async function fetchUsersFromDb() {
    const response = await fetch(`${api}Users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 500) {
      setIsError(true);
      setDialogMsg("Something went wrong. Please try again.");
      setShowDialog(true);
    } else {
      const usersFromDb = await response.json();
      setUsersList(usersFromDb);
    }
  }

  function handleCloseDialog() {
    setShowDialog(false);
  }

  function handleIsError(value) {
    setIsError(value);
  }

  function handleDialogMsg(message) {
    setDialogMsg(message);
  }

  function handleShowDialog(value) {
    setShowDialog(value);
  }

  function handleIsAverage(value) {
    setIsAverage(value);
  }

  function handleAvgPriceList(list) {
    setAvgPriceList(list);
  }

  return (
    <Layout title="Welcome back Admin">
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
      <Stack direction="row" spacing={2} sx={{ width: "90wh", paddingY: 4, margin: "0 auto" }}>
        <Button variant="contained" onClick={() => setIsManage(!isManage)}>
          {isManage ? "close table" : "manage users"}
        </Button>
        <DropDown
          isError={handleIsError}
          DialogMessage={handleDialogMsg}
          showDialog={handleShowDialog}
          changeIsAverage={handleIsAverage}
          changeAvgPriceList={handleAvgPriceList}
          api={api}
        />
      </Stack>
      {isManage && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">First Name</TableCell>
                <TableCell align="center">Last Name</TableCell>
                <TableCell align="center">isActive</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersList.map((user, index) => (
                <Row
                  user={user}
                  key={index}
                  isError={handleIsError}
                  DialogMessage={handleDialogMsg}
                  showDialog={handleShowDialog}
                  api={api}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {isAverage && <AvgPriceTable avgPriceList={avgPriceList} />}
    </Layout>
  );
}

function Row({ user, isError, DialogMessage, showDialog, api }) {
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(user.isActive);
  const [vacations, setVacations] = useState([]);
  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    fetchUserVacations();
  }, []);

  useEffect(() => {
    if (!firstRender) {
      updateIsActive();
    }
  }, [isChecked]);

  async function updateIsActive() {
    const response = await fetch(
      `${api}Users/UpdateIsActive/email/${user.email}/isActive/${isChecked}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status === 400) {
      isError(true);
      DialogMessage("something went wrong. Please try again later.");
      showDialog(true);
    } else {
      let message;
      if (isChecked) message = `${user.email} is active now.`;
      else message = `${user.email} is not active anymore.`;
      isError(false);
      DialogMessage(message);
      showDialog(true);
    }
  }

  async function fetchUserVacations() {
    const response = await fetch(
      `${api}Vacations/userVacations?userEmail=${`${user.email}`}`,
      {
        method: "GET",
        headers: { "Content-Type": "text/plain" },
      }
    );
    const vacationsFromServer = await response.json();
    setVacations(vacationsFromServer);
  }

  function handleIsActiveChange() {
    setIsChecked((prev) => !prev);
    setFirstRender(false);
  }

  return (
    <React.Fragment>
      <TableRow key={user.email} sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{user.email}</TableCell>
        <TableCell align="center">{user.firstName}</TableCell>
        <TableCell align="center">{user.lastName}</TableCell>
        <TableCell align="center">
          {<Checkbox checked={isChecked} onChange={handleIsActiveChange} />}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {user.firstName}'s vacations
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Flat id</TableCell>
                    <TableCell align="center">Arrival Date</TableCell>
                    <TableCell align="center">Leaving Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vacations.map((vacation, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {vacation.flatId}
                      </TableCell>
                      <TableCell align="center">{vacation.startDate}</TableCell>
                      <TableCell align="center">{vacation.endDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
