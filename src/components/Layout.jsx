import React from "react";
import { Box, Stack, Typography } from "@mui/material";

export default function Layout({ children, title, greet }) {
  return (
    <Box>
      {greet && (
        <Typography sx={{ marginRight: 7, marginBottom: 3 }} variant="h5">
          {greet}
        </Typography>
      )}
      <Typography
        variant="h3"
        component="h2"
        gutterBottom={true}
        align="center"
        sx={{
          textDecoration: "underline",
          fontWeight: "bold",
        }}
      >
        {title}
      </Typography>
      <Stack direction='column' alignItems='center' spacing={4}>{children}</Stack>
    </Box>
  );
}
