import type { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';
import { Container, Box } from '@mui/material';
import { RegionProvider } from '@/contexts/RegionContext';
import RegionPicker from '@/components/RegionPicker';

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
          <RegionProvider>
            <Container component="main" sx={{ mt: 2 }}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <RegionPicker />
              </Box>
              {children}
            </Container>
          </RegionProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
