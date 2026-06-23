"use client"
import { useState, useEffect } from "react"
import { Container, Typography, Paper, Grid, Box } from "@mui/material"
import FormValidationComponent from "@/components/FormValidationComponent"
import DataTable from "@/components/DataTable"
import toast from "react-hot-toast"

interface FormData {
  id: string
  username: string
  email: string
  age: number
  bio: string
  salary: number
  createdAt: string
}

export default function FormValidationPage() {
  const [submittedData, setSubmittedData] = useState<FormData[]>([])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/form-data")
      const data = await response.json()
      setSubmittedData(data)
    } catch (error) {
      toast.error("Failed to fetch submitted data")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFormSubmit = () => {
    fetchData() // Refresh data after form submission
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Formik Form Validation Testing
        </Typography>
        <Typography
          variant="body1"
          color="text.white"
          sx={{ fontSize: "1.1rem", maxWidth: 600, mx: "auto" }}
        >
          Practice testing forms with Formik and Yup validation schema in realistic scenarios
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={2} sx={{ p: 4, height: "fit-content" }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Validation Form
            </Typography>
            <FormValidationComponent onSubmitSuccess={handleFormSubmit} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={2} sx={{ p: 4, height: "fit-content" }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Submitted Data ({submittedData.length} entries)
            </Typography>
            <DataTable data={submittedData} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
