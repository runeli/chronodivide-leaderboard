import type { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';

export const metadata: Metadata = {
  title: 'Chrono Divide Replays',
  description: 'Community statistics and replay viewer for Chrono Divide',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeRegistry>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Chrono Divide Replays
              </Typography>
            </Toolbar>
          </AppBar>
          <Container component="main" sx={{ mt: 4 }}>
            {children}
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  );
}
