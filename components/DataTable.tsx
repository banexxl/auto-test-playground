"use client"
import type React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material"

interface FormData {
  id: string
  username: string
  email: string
  age: number
  bio: string
  salary: number
  createdAt: string
}

interface Props {
  data: FormData[]
}

const DataTable: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
        No data submitted yet. Fill out the form to see entries here.
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" data-testid="data-table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Bio</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Submitted</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} data-testid={`table-row-${row.id}`}>
              <TableCell>
                <Chip label={row.username} size="small" color="primary" />
              </TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.age}</TableCell>
              <TableCell
                sx={{
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={row.bio}
              >
                {row.bio}
              </TableCell>
              <TableCell>${row.salary.toLocaleString()}</TableCell>
              <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable
