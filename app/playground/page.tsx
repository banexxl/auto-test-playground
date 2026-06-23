import { Container, Typography, Box } from "@mui/material"
import InteractiveComponents from "@/components/InteractiveComponents"

export default function PlaygroundPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          UI Components Playground
        </Typography>
        <Typography
          variant="body1"
          color="text.white"
          sx={{ fontSize: "1.1rem", maxWidth: 600, mx: "auto" }}
        >
          Practice testing various UI components and interactions in a controlled environment
        </Typography>
      </Box>

      <InteractiveComponents />
    </Container>
  )
}
