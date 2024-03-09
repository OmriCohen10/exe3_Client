import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

export default function AvgPriceTable({ avgPriceList }) {
  return (
    <>
      {Object.entries(avgPriceList).length === 0 ? (
        <Typography variant="h6" component="p">
          There aren't any vacations at all in this particular month.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ width: 300 }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography variant="h6">City</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6">Avg. price</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(avgPriceList).map(([key, value], index) => (
                <TableRow key={index}>
                  <TableCell align="center">{key}</TableCell>
                  <TableCell align="center">{value.toFixed(2)} $</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
