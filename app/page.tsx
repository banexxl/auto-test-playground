import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Button, Stack, Avatar } from "@mui/material"
import Link from "next/link"

export default function Home() {
  const features = [
    {
      title: "Form Validation Testing",
      description:
        "Practice testing forms with various validation rules, string length limits, and number constraints.",
      href: "/form-validation",
      color: "primary.main",
    },
    {
      title: "Fake Store",
      description: "Test e-commerce scenarios with product listings, cart functionality, and checkout flows.",
      href: "/store",
      color: "secondary.main",
    },
    {
      title: "UI Components Playground",
      description: "Interactive components for practicing different testing scenarios and selector strategies.",
      href: "/playground",
      color: "success.main",
    },
    {
      title: "Weather Forecast",
      description: "Check the current weather and 5-day forecast for your location using a live API.",
      href: "/weather",
      color: "info.main",
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, rgb(253, 242, 246),#1976d2)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to Test Automation Playground
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
                borderTop: 4,
                borderTopColor: feature.color,
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  size="large"
                  component={Link}
                  href={feature.href}
                  variant="contained"
                  sx={{
                    backgroundColor: feature.color,
                    "&:hover": {
                      backgroundColor: feature.color,
                      filter: "brightness(0.9)",
                    },
                  }}
                >
                  Explore
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 10, width: "100%", display: "flex", justifyContent: "center", pointerEvents: "none", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h5"
          color="text.secondary"
          align="center"
          sx={{
            maxWidth: 800,
            mx: "auto",
            lineHeight: 1.6,
            color: "rgba(11, 37, 61, 0.8)",
            background: "rgba(255,255,255,0.85)",
            borderRadius: 2,
            px: 3,
            py: 1,
            boxShadow: 2,
            pointerEvents: "auto",
            textAlign: "center",
          }}
        >
          Maxbet mini platform for test automation with modern web technologies
        </Typography>
        <Card
          elevation={3}
          sx={{
            maxWidth: 700,
            mx: "auto",
            background: "rgba(255,255,255,0.85)",
            borderRadius: 2,
            boxShadow: 1,
            pointerEvents: "auto",
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
              flexWrap="wrap"
            >
              <Typography
                variant="body1"
                sx={{ fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.6 }}
              >
                Built with
              </Typography>

              <Link
                href="https://nextjs.org"
                passHref
                target="_blank"
                style={{ display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", color: "inherit" }}
              >
                <Avatar
                  alt="Next.js"
                  src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg"
                  variant="square"
                  sx={{ width: 28, height: 28, bgcolor: "transparent" }}
                />
                <Box component="span" fontWeight="bold">Next.js</Box>
              </Link>
              ,

              <Link
                href="https://reactjs.org"
                passHref
                target="_blank"
                style={{ display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", color: "inherit" }}
              >
                <Avatar
                  alt="React"
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                  variant="square"
                  sx={{ width: 28, height: 28, bgcolor: "transparent" }}
                />
                <Box component="span" fontWeight="bold">React</Box>
              </Link>
              ,

              <Link
                href="https://mui.com"
                passHref
                target="_blank"
                style={{ display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", color: "inherit" }}
              >
                <Avatar
                  alt="MUI"
                  src="https://cdn.worldvectorlogo.com/logos/material-ui.svg"
                  variant="square"
                  sx={{ width: 28, height: 28, bgcolor: "transparent" }}
                />
                <Box component="span" fontWeight="bold">MUI</Box>
              </Link>
              , and

              <Link
                href="https://supabase.com"
                passHref
                target="_blank"
                style={{ display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", color: "inherit" }}
              >
                <Avatar
                  alt="Supabase"
                  src="https://vectorlogo.zone/logos/supabase/supabase-icon.svg"
                  variant="square"
                  sx={{ width: 28, height: 28, bgcolor: "transparent" }}
                />
                <Box component="span" fontWeight="bold">Supabase</Box>
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
