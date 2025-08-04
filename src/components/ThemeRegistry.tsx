'use client';
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000', // Red
      contrastText: '#ffff00', // Yellow
    },
    secondary: {
      main: '#ffff00', // Yellow
      contrastText: '#000000', // Black
    },
    background: {
      default: '#000000', // Black
      paper: 'rgba(0, 0, 0, 0.75)', // Semi-transparent black
    },
    text: {
      primary: '#ffff00', // Yellow
      secondary: '#ffffff', // White for secondary text
    },
    error: {
      main: '#ff0000', // Red
    },
    warning: {
      main: '#ffa500', // Orange
    },
    success: {
      main: '#00ff00', // Lime green
    },
    info: {
      main: '#00ffff', // Cyan
    },
    divider: '#ff0000', // Red borders
  },
  typography: {
    fontFamily: '"Fira Sans Condensed"',
    fontSize: 13,
    fontWeightMedium: 500,
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#ffff00',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#ffff00',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#ffff00',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#ffff00',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#ffff00',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#ffff00',
    },
    body1: {
      fontSize: 13,
      color: '#ffff00',
    },
    body2: {
      fontSize: 13,
      color: '#ffff00',
    },
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
          fontSize: '13px',
          color: '#ffff00',
          fontWeight: 500,
        },
        'a:link, a:visited': {
          color: '#ff0000',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          border: '1px solid #ff0000',
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid #ff0000',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          color: '#ffff00',
          fontSize: 13,
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#ff0000',
            borderColor: '#ff0000',
            color: '#ffff00',
          },
          '&:disabled': {
            color: '#9c0000',
            borderColor: '#9c0000',
          },
        },
        contained: {
          backgroundColor: '#ff0000',
          '&:hover': {
            backgroundColor: '#ff4500', // Orange red
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            backgroundColor: 'transparent',
            '& fieldset': {
              borderColor: '#ff0000',
            },
            '&:hover fieldset': {
              borderColor: '#ff0000',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff0000',
            },
            '& input': {
              color: '#ffff00',
              fontSize: 13,
              paddingLeft: '4px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#ffff00',
            fontSize: 13,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: 'transparent',
          border: '1px solid #ff0000',
          color: '#ffff00',
          fontSize: 13,
          '&:focus': {
            backgroundColor: 'transparent',
          },
        },
        icon: {
          color: '#ffff00',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              borderColor: '#ff0000',
            },
            '&:hover fieldset': {
              borderColor: '#ff0000',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff0000',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#ffff00',
            fontSize: 13,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          border: '1px solid #ff0000',
          borderCollapse: 'collapse',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            borderBottom: '1px solid #ff0000',
            backgroundColor: 'transparent',
            color: '#ffff00',
            fontSize: 13,
            fontWeight: 500,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: 'rgba(21, 21, 21, 0.75)',
          },
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(55, 55, 55, 0.75)',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#ff0000',
          color: '#ffff00',
          fontSize: 13,
          padding: '3px 8px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid #ff0000',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          color: '#ffff00',
          fontSize: 13,
        },
        colorPrimary: {
          backgroundColor: '#ff0000',
          color: '#ffff00',
        },
        colorWarning: {
          backgroundColor: '#ffa500',
          color: '#000000',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#ff0000',
          textDecoration: 'none',
          '&:hover': {
            color: '#ff4500',
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid #ff0000',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          color: '#ffff00',
        },
        standardError: {
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 165, 0, 0.2)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 0,
            border: '1px solid #ff0000',
            backgroundColor: 'rgba(72, 0, 0, 1)',
            color: '#ffff00',
            margin: '0 2px',
            '&:hover': {
              backgroundColor: '#ff4500',
            },
            '&.Mui-selected': {
              backgroundColor: '#ff0000',
              color: '#ffff00',
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              borderColor: '#ff0000',
            },
          },
        },
        paper: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '1px solid #ff0000',
          borderRadius: 0,
        },
        option: {
          color: '#ffff00',
          '&[aria-selected="true"]': {
            backgroundColor: '#ff0000',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.3)',
          },
        },
      },
    },
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
