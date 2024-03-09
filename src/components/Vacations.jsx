import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { calcDateDifference } from "../utility/functions";

export default function Vacations({ vacationsList }) {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  vacationsList.forEach((vacation) => {
    vacation.duration = calcDateDifference(
      vacation.startDate,
      vacation.endDate
    );
  });
  return (
    <Box sx={{ width: "100wh", paddingY: 2, margin: "0 auto" }}>
      {vacationsList.length === 0 ? (
        <Typography variant="h6" component="div">
          You don't have any vacations yet! try order new one.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h3" textAlign="center" mb={2}>
              {currentUser.firstName}'s vacations:
            </Typography>
          </Grid>
          {vacationsList.map((vacation) => (
            <Grid item key={vacation.id} xs={8} sm={6}>
              <Card sx={{ minWidth: 200 }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    gutterBottom
                    sx={{ textDecoration: "underline" }}
                  >
                    Order number: {vacation.id}
                  </Typography>
                  <Typography variant="h6" component="div">
                    Arrival Date: {vacation.startDate}
                  </Typography>
                  <Typography variant="h6">
                    Leaving Date: {vacation.endDate}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}></CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
