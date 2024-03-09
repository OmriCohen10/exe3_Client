import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack, Typography } from "@mui/material";
export default function DialogMessage({
  openDialog,
  closeDialog,
  title,
  colorMsg,
  colorBtn,
  children,
  closeBtn,
  contentStyle,
}) {
  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={openDialog}
        onClose={closeDialog}
      >
        <DialogTitle
          color={colorMsg}
          component="div"
          sx={{
            textAlign: "center",
            textDecoration: "underline",
          }}
        >
          <Typography variant="h4">{title}</Typography>
        </DialogTitle>
        <DialogContent sx={contentStyle}>
          <Typography
            variant="h5"
            component="p"
            sx={{ textAlign: "center", marginBottom: 2 }}
          >
            {children}
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={4}>
            <Button variant="contained" onClick={closeDialog} color={colorBtn}>
              {closeBtn}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
