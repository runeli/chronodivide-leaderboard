"use client";
import * as React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled, alpha, lighten, darken } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => {
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const textPrimary = theme.palette.text.primary;
  const gradientTop = darken(primary, 0.25);
  const gradientBottom = darken(primary, 0.55);
  const hoverTop = lighten(primary, 0.2);
  const hoverBottom = darken(primary, 0.2);
  const activeCenter = secondary;

  return {
    color: textPrimary,
    textTransform: "uppercase",
    cursor: "pointer",
    border: `2px solid ${primary}`,
    borderRadius: 0,
    boxShadow: "inset 0 0 0 2px #000000",
    background: `radial-gradient(ellipse at center, ${alpha(secondary, 0.4)} 0%, rgba(255,255,255,0) 60%), linear-gradient(to bottom, ${gradientTop}, ${gradientBottom})`,
    transition: "none",
    "&:hover": {
      boxShadow: "inset 0 0 0 2px #000000",
      borderColor: lighten(primary, 0.25),
      background: `radial-gradient(ellipse at center, ${alpha(secondary, 0.5)} 0%, rgba(255,255,255,0) 65%), linear-gradient(to bottom, ${hoverTop}, ${hoverBottom})`,
    },
    "&:active": {
      borderColor: activeCenter,
      background: `radial-gradient(ellipse at center, ${activeCenter} 0%, ${hoverTop} 100%)`,
      textShadow: "none",
    },
  };
});

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
