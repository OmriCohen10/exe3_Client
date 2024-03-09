import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function Flats({ flatsList, redirectTo }) {
  function handleOrderBtn(flat) {
    sessionStorage.setItem("flat", JSON.stringify(flat));
    redirectTo("vacations");
  }
  return (
    <Box sx={{ width: "100wh", paddingY: 2, margin: "0 auto" }}>
      {flatsList.length === 0 ? (
        <Typography variant="h6" component="div">
          There aren't flats yet! Be the first to insert one.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {flatsList.map((flat) => (
            <Grid item key={flat.id} xs={8} sm={6}>
              <Card sx={{ minWidth: 300 }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    gutterBottom
                    sx={{ textDecoration: "underline" }}
                  >
                    Flat number: {flat.id}
                  </Typography>
                  <Typography variant="h6" component="div">
                    City: {flat.city}
                  </Typography>
                  <Typography variant="h6">Address: {flat.address}</Typography>
                  <Typography variant="h6">
                    Rooms: {flat.numOfRooms}
                    <br />
                    Price: {flat.price} $
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button size="medium" onClick={() => handleOrderBtn(flat)}>
                    Order Vacation!
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
