import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function Navigation({ updateRoute, configuration }) {
  return (
    <Stack
      sx={{ marginBottom: 0, paddingX: 4, paddingY: 2, cursor: "pointer" }}
      direction="row"
      spacing={3}
    >
      {configuration.map((btn, i) => (
        <Button
          key={i}
          sx={{ gap: 1, fontSize: 20 }}
          variant="text"
          size="large"
          onClick={() => updateRoute(btn.route)}
          startIcon={btn.icon}
        >
          {btn.value}
        </Button>
      ))}
    </Stack>
  );
}
