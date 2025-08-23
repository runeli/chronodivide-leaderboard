"use client";
import * as React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(() => ({
  color: "#FFD700",
  textTransform: "uppercase",
  cursor: "pointer",
  border: "2px solid #ff0000",
  borderRadius: 0,
  boxShadow: "inset 0 0 0 2px #000000",
  background:
    "radial-gradient(ellipse at center, rgba(255, 220, 150, 0.4) 0%, rgba(255,255,255,0) 60%), linear-gradient(to bottom, #a00000, #4d0000)",
  transition: "none",
  "&:hover": {
    boxShadow: "inset 0 0 0 2px #000000",
    borderColor: "#ff8c00",
    background:
      "radial-gradient(ellipse at center, rgba(255, 230, 160, 0.5) 0%, rgba(255,255,255,0) 65%), linear-gradient(to bottom, #ff9c20, #b85a00)",
  },
  "&:active": {
    borderColor: "#ffff00",
    background: "radial-gradient(ellipse at center, #ffff00 0%, #ff8c00 100%)",
    textShadow: "none",
  },
}));

export default function RA2Button(props: ButtonProps) {
  const { variant, disableElevation, disableRipple, ...rest } = props;
  return (
    <StyledButton
      variant={variant ?? "text"}
      disableElevation={disableElevation ?? true}
      disableRipple={disableRipple ?? true}
      {...rest}
    />
  );
}
