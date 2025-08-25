"use client";

import { createTheme } from "@mui/material/styles";

export const sovietTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff0000",
      contrastText: "#ffff00",
    },
    secondary: {
      main: "#ffff00",
      contrastText: "#000000",
    },
    background: {
      default: "#000000",
      paper: "rgba(0, 0, 0, 0.75)",
    },
    text: {
      primary: "#ffff00",
      secondary: "#ffffff",
    },
    error: {
      main: "#ff0000",
    },
    warning: {
      main: "#ffa500",
    },
    success: {
      main: "#00ff00",
    },
    info: {
      main: "#00ffff",
    },
    divider: "#ff0000",
  },
  typography: {
    fontFamily: '"Fira Sans Condensed"',
    fontSize: 13,
    fontWeightMedium: 500,
    h1: { fontSize: "2rem", fontWeight: 500, color: "#ffff00" },
    h2: { fontSize: "1.75rem", fontWeight: 500, color: "#ffff00" },
    h3: { fontSize: "1.5rem", fontWeight: 500, color: "#ffff00" },
    h4: { fontSize: "1.25rem", fontWeight: 500, color: "#ffff00" },
    h5: { fontSize: "1.125rem", fontWeight: 500, color: "#ffff00" },
    h6: { fontSize: "1rem", fontWeight: 500, color: "#ffff00" },
    body1: { fontSize: 13, color: "#ffff00" },
    body2: { fontSize: 13, color: "#ffff00" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `
            radial-gradient(circle at 25% 25%, rgba(255, 0, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 0, 0.03) 0%, transparent 50%),
            linear-gradient(45deg, 
              rgba(40, 40, 40, 0.6) 25%, 
              transparent 25%, 
              transparent 75%, 
              rgba(40, 40, 40, 0.6) 75%, 
              rgba(40, 40, 40, 0.6)
            ),
            linear-gradient(-45deg, 
              rgba(40, 40, 40, 0.6) 25%, 
              transparent 25%, 
              transparent 75%, 
              rgba(40, 40, 40, 0.6) 75%, 
              rgba(40, 40, 40, 0.6)
            ),
            #1a1a1a
          `,
          backgroundSize: `
            800px 800px,
            600px 600px,
            60px 60px,
            60px 60px,
            auto
          `,
          backgroundPosition: `
            0 0,
            400px 400px,
            0 0,
            30px 30px,
            0 0
          `,
          fontFamily: '"Fira Sans Condensed"',
          fontSize: "13px",
          color: "#ffff00",
          fontWeight: 500,
        },
        "a:link, a:visited": {
          color: "#ff0000",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          border: "1px solid #ff0000",
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "1px solid #ff0000",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "#ffff00",
          fontSize: 13,
          fontWeight: 500,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#ff0000",
            borderColor: "#ff0000",
            color: "#ffff00",
          },
          "&:disabled": {
            color: "#9c0000",
            borderColor: "#9c0000",
          },
        },
        contained: {
          backgroundColor: "#ff0000",
          "&:hover": {
            backgroundColor: "#ff4500",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            backgroundColor: "transparent",
            "& fieldset": {
              borderColor: "#ff0000",
            },
            "&:hover fieldset": {
              borderColor: "#ff0000",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ff0000",
            },
            "& input": {
              color: "#ffff00",
              fontSize: 13,
              paddingLeft: "4px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#ffff00",
            fontSize: 13,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: "transparent",
          border: "1px solid #ff0000",
          color: "#ffff00",
          fontSize: 13,
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
        icon: {
          color: "#ffff00",
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& fieldset": {
              borderColor: "#ff0000",
            },
            "&:hover fieldset": {
              borderColor: "#ff0000",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ff0000",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#ffff00",
            fontSize: 13,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          border: "1px solid #ff0000",
          borderCollapse: "collapse",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            borderBottom: "1px solid #ff0000",
            backgroundColor: "transparent",
            color: "#ffff00",
            fontSize: 13,
            fontWeight: 500,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": {
            backgroundColor: "rgba(21, 21, 21, 0.75)",
          },
          "&:nth-of-type(odd)": {
            backgroundColor: "rgba(55, 55, 55, 0.75)",
          },
          "&:hover": {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#ff0000",
          color: "#ffff00",
          fontSize: 13,
          padding: "3px 8px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "1px solid #ff0000",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "#ffff00",
          fontSize: 13,
        },
        colorPrimary: {
          backgroundColor: "#ff0000",
          color: "#ffff00",
        },
        colorWarning: {
          backgroundColor: "#ffa500",
          color: "#000000",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#ff0000",
          textDecoration: "none",
          "&:hover": {
            color: "#ff4500",
            textDecoration: "underline",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "1px solid #ff0000",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "#ffff00",
        },
        standardError: {
          backgroundColor: "rgba(255, 0, 0, 0.2)",
        },
        standardWarning: {
          backgroundColor: "rgba(255, 165, 0, 0.2)",
        },
        standardSuccess: {
          backgroundColor: "rgba(0, 255, 0, 0.2)",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            borderRadius: 0,
            border: "1px solid #ff0000",
            backgroundColor: "rgba(72, 0, 0, 1)",
            color: "#ffff00",
            margin: "0 2px",
            "&:hover": {
              backgroundColor: "#ff4500",
            },
            "&.Mui-selected": {
              backgroundColor: "#ff0000",
              color: "#ffff00",
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& fieldset": {
              borderColor: "#ff0000",
            },
          },
        },
        paper: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "1px solid #ff0000",
          borderRadius: 0,
        },
        option: {
          color: "#ffff00",
          '&[aria-selected="true"]': {
            backgroundColor: "#ff0000",
          },
          "&:hover": {
            backgroundColor: "rgba(255, 0, 0, 0.3)",
          },
        },
      },
    },
  },
});

export const alliedTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196f3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#bbdefb",
      contrastText: "#000000",
    },
    background: {
      default: "#000000",
      paper: "rgba(0, 0, 0, 0.75)",
    },
    text: {
      primary: "#e3f2fd",
      secondary: "#ffffff",
    },
    error: {
      main: "#ff0000",
    },
    warning: {
      main: "#ffa500",
    },
    success: {
      main: "#00ff00",
    },
    info: {
      main: "#00ffff",
    },
    divider: "#2196f3",
  },
  typography: {
    fontFamily: '"Fira Sans Condensed"',
    fontSize: 13,
    fontWeightMedium: 500,
    h1: { fontSize: "2rem", fontWeight: 500, color: "#e3f2fd" },
    h2: { fontSize: "1.75rem", fontWeight: 500, color: "#e3f2fd" },
    h3: { fontSize: "1.5rem", fontWeight: 500, color: "#e3f2fd" },
    h4: { fontSize: "1.25rem", fontWeight: 500, color: "#e3f2fd" },
    h5: { fontSize: "1.125rem", fontWeight: 500, color: "#e3f2fd" },
    h6: { fontSize: "1rem", fontWeight: 500, color: "#e3f2fd" },
    body1: { fontSize: 13, color: "#e3f2fd" },
    body2: { fontSize: 13, color: "#e3f2fd" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `
            radial-gradient(circle at 25% 25%, rgba(33, 150, 243, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(187, 222, 251, 0.03) 0%, transparent 50%),
            linear-gradient(45deg, 
              rgba(40, 40, 40, 0.6) 25%, 
              transparent 25%, 
              transparent 75%, 
              rgba(40, 40, 40, 0.6) 75%, 
              rgba(40, 40, 40, 0.6)
            ),
            linear-gradient(-45deg, 
              rgba(40, 40, 40, 0.6) 25%, 
              transparent 25%, 
              transparent 75%, 
              rgba(40, 40, 40, 0.6) 75%, 
              rgba(40, 40, 40, 0.6)
            ),
            #0f141a
          `,
          backgroundSize: `
            800px 800px,
            600px 600px,
            60px 60px,
            60px 60px,
            auto
          `,
          backgroundPosition: `
            0 0,
            400px 400px,
            0 0,
            30px 30px,
            0 0
          `,
          fontFamily: '"Fira Sans Condensed"',
          fontSize: "13px",
          color: "#e3f2fd",
          fontWeight: 500,
        },
        "a:link, a:visited": {
          color: "#2196f3",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          border: "1px solid #2196f3",
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "1px solid #2196f3",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "#e3f2fd",
          fontSize: 13,
          fontWeight: 500,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#2196f3",
            borderColor: "#2196f3",
            color: "#e3f2fd",
          },
          "&:disabled": {
            color: "#0d47a1",
            borderColor: "#0d47a1",
          },
        },
        contained: {
          backgroundColor: "#2196f3",
          "&:hover": {
            backgroundColor: "#1976d2",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            backgroundColor: "transparent",
            "& fieldset": {
              borderColor: "#2196f3",
            },
            "&:hover fieldset": {
              borderColor: "#2196f3",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2196f3",
            },
            "& input": {
              color: "#e3f2fd",
              fontSize: 13,
              paddingLeft: "4px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#e3f2fd",
            fontSize: 13,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: "transparent",
          border: "1px solid #2196f3",
          color: "#e3f2fd",
          fontSize: 13,
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
        icon: {
          color: "#e3f2fd",
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& fieldset": {
              borderColor: "#2196f3",
            },
            "&:hover fieldset": {
              borderColor: "#2196f3",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2196f3",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#e3f2fd",
            fontSize: 13,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          border: "1px solid #2196f3",
          borderCollapse: "collapse",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            borderBottom: "1px solid #2196f3",
            backgroundColor: "transparent",
            color: "#e3f2fd",
            fontSize: 13,
            fontWeight: 500,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": {
            backgroundColor: "rgba(21, 21, 21, 0.75)",
          },
          "&:nth-of-type(odd)": {
            backgroundColor: "rgba(55, 55, 55, 0.75)",
          },
          "&:hover": {
            backgroundColor: "rgba(33, 150, 243, 0.2)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#2196f3",
          color: "#e3f2fd",
          fontSize: 13,
          padding: "3px 8px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "1px solid #2196f3",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "#e3f2fd",
          fontSize: 13,
        },
        colorPrimary: {
          backgroundColor: "#2196f3",
          color: "#e3f2fd",
        },
        colorWarning: {
          backgroundColor: "#ffa500",
          color: "#000000",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#2196f3",
          textDecoration: "none",
          "&:hover": {
            color: "#1976d2",
            textDecoration: "underline",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "1px solid #2196f3",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "#e3f2fd",
        },
        standardError: {
          backgroundColor: "rgba(255, 0, 0, 0.2)",
        },
        standardWarning: {
          backgroundColor: "rgba(255, 165, 0, 0.2)",
        },
        standardSuccess: {
          backgroundColor: "rgba(0, 255, 0, 0.2)",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            borderRadius: 0,
            border: "1px solid #2196f3",
            backgroundColor: "rgba(0, 24, 48, 1)",
            color: "#e3f2fd",
            margin: "0 2px",
            "&:hover": {
              backgroundColor: "#1976d2",
            },
            "&.Mui-selected": {
              backgroundColor: "#2196f3",
              color: "#e3f2fd",
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& fieldset": {
              borderColor: "#2196f3",
            },
          },
        },
        paper: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "1px solid #2196f3",
          borderRadius: 0,
        },
        option: {
          color: "#e3f2fd",
          '&[aria-selected="true"]': {
            backgroundColor: "#2196f3",
          },
          "&:hover": {
            backgroundColor: "rgba(33, 150, 243, 0.3)",
          },
        },
      },
    },
  },
});

export const neutralTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#26a69a",
      contrastText: "#e0f2f1",
    },
    secondary: {
      main: "#80cbc4",
      contrastText: "#000000",
    },
    background: {
      default: "#0f1214",
      paper: "rgba(0, 0, 0, 0.75)",
    },
    text: {
      primary: "#e0f2f1",
      secondary: "#ffffff",
    },
    error: {
      main: "#ef5350",
    },
    warning: {
      main: "#ffa500",
    },
    success: {
      main: "#4caf50",
    },
    info: {
      main: "#00bcd4",
    },
    divider: "#26a69a",
  },
  typography: {
    fontFamily: '"Fira Sans Condensed"',
    fontSize: 13,
    fontWeightMedium: 500,
    h1: { fontSize: "2rem", fontWeight: 500, color: "#e0f2f1" },
    h2: { fontSize: "1.75rem", fontWeight: 500, color: "#e0f2f1" },
    h3: { fontSize: "1.5rem", fontWeight: 500, color: "#e0f2f1" },
    h4: { fontSize: "1.25rem", fontWeight: 500, color: "#e0f2f1" },
    h5: { fontSize: "1.125rem", fontWeight: 500, color: "#e0f2f1" },
    h6: { fontSize: "1rem", fontWeight: 500, color: "#e0f2f1" },
    body1: { fontSize: 13, color: "#e0f2f1" },
    body2: { fontSize: 13, color: "#e0f2f1" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `
            radial-gradient(circle at 25% 25%, rgba(38, 166, 154, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(128, 203, 196, 0.03) 0%, transparent 50%),
            linear-gradient(45deg, 
              rgba(40, 40, 40, 0.6) 25%, 
              transparent 25%, 
              transparent 75%, 
              rgba(40, 40, 40, 0.6) 75%, 
              rgba(40, 40, 40, 0.6)
            ),
            linear-gradient(-45deg, 
              rgba(40, 40, 40, 0.6) 25%, 
              transparent 25%, 
              transparent 75%, 
              rgba(40, 40, 40, 0.6) 75%, 
              rgba(40, 40, 40, 0.6)
            ),
            #0f1214
          `,
          backgroundSize: `
            800px 800px,
            600px 600px,
            60px 60px,
            60px 60px,
            auto
          `,
          backgroundPosition: `
            0 0,
            400px 400px,
            0 0,
            30px 30px,
            0 0
          `,
          fontFamily: '"Fira Sans Condensed"',
          fontSize: "13px",
          color: "#e0f2f1",
          fontWeight: 500,
        },
        "a:link, a:visited": {
          color: "#26a69a",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          border: "1px solid #26a69a",
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "1px solid #26a69a",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "#e0f2f1",
          fontSize: 13,
          fontWeight: 500,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#26a69a",
            borderColor: "#26a69a",
            color: "#e0f2f1",
          },
          "&:disabled": {
            color: "#0a5a52",
            borderColor: "#0a5a52",
          },
        },
        contained: {
          backgroundColor: "#26a69a",
          "&:hover": {
            backgroundColor: "#1f8f85",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            backgroundColor: "transparent",
            "& fieldset": {
              borderColor: "#26a69a",
            },
            "&:hover fieldset": {
              borderColor: "#26a69a",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#26a69a",
            },
            "& input": {
              color: "#e0f2f1",
              fontSize: 13,
              paddingLeft: "4px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#e0f2f1",
            fontSize: 13,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: "transparent",
          border: "1px solid #26a69a",
          color: "#e0f2f1",
          fontSize: 13,
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
        icon: {
          color: "#e0f2f1",
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& fieldset": {
              borderColor: "#26a69a",
            },
            "&:hover fieldset": {
              borderColor: "#26a69a",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#26a69a",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#e0f2f1",
            fontSize: 13,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          border: "1px solid #26a69a",
          borderCollapse: "collapse",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            borderBottom: "1px solid #26a69a",
            backgroundColor: "transparent",
            color: "#e0f2f1",
            fontSize: 13,
            fontWeight: 500,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": {
            backgroundColor: "rgba(21, 21, 21, 0.75)",
          },
          "&:nth-of-type(odd)": {
            backgroundColor: "rgba(55, 55, 55, 0.75)",
          },
          "&:hover": {
            backgroundColor: "rgba(38, 166, 154, 0.2)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#26a69a",
          color: "#e0f2f1",
          fontSize: 13,
          padding: "3px 8px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "1px solid #26a69a",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "#e0f2f1",
          fontSize: 13,
        },
        colorPrimary: {
          backgroundColor: "#26a69a",
          color: "#e0f2f1",
        },
        colorWarning: {
          backgroundColor: "#ffa500",
          color: "#000000",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#26a69a",
          textDecoration: "none",
          "&:hover": {
            color: "#1f8f85",
            textDecoration: "underline",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "1px solid #26a69a",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "#e0f2f1",
        },
        standardError: {
          backgroundColor: "rgba(239, 83, 80, 0.2)",
        },
        standardWarning: {
          backgroundColor: "rgba(255, 165, 0, 0.2)",
        },
        standardSuccess: {
          backgroundColor: "rgba(76, 175, 80, 0.2)",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            borderRadius: 0,
            border: "1px solid #26a69a",
            backgroundColor: "rgba(6, 30, 28, 1)",
            color: "#e0f2f1",
            margin: "0 2px",
            "&:hover": {
              backgroundColor: "#1f8f85",
            },
            "&.Mui-selected": {
              backgroundColor: "#26a69a",
              color: "#e0f2f1",
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& fieldset": {
              borderColor: "#26a69a",
            },
          },
        },
        paper: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "1px solid #26a69a",
          borderRadius: 0,
        },
        option: {
          color: "#e0f2f1",
          '&[aria-selected="true"]': {
            backgroundColor: "#26a69a",
          },
          "&:hover": {
            backgroundColor: "rgba(38, 166, 154, 0.3)",
          },
        },
      },
    },
  },
});
