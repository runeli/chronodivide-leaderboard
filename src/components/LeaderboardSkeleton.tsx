"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Box } from "@mui/material";

export default function LeaderboardSkeleton() {
  return (
    <TableContainer>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Skeleton variant="text" width={40} height={20} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={60} height={20} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={40} height={20} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={50} height={20} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={60} height={20} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={80} height={20} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 25 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton variant="rectangular" width={40} height={24} sx={{ borderRadius: 1 }} />
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Skeleton variant="text" width={120} height={16} />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Skeleton variant="circular" width={14} height={14} />
                    <Skeleton variant="text" width={80} height={12} />
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={50} height={16} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={30} height={16} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={30} height={16} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={40} height={16} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
