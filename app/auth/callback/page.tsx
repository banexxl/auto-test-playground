"use client"
import React, { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Alert, Box, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material"

function CallbackHandler() {
     const searchParams = useSearchParams()
     const [error, setError] = useState<string | null>(null)

     useEffect(() => {
          // The server-side Route Handler at /auth/callback is the only place
          // that can read the PKCE code_verifier cookie set by @supabase/ssr.
          // Forward the user there immediately, preserving query + hash. The
          // Route Handler calls exchangeCodeForSession and then redirects.
          try {
               const search = window.location.search || ""
               const hash = window.location.hash || ""
               const target = `/auth/callback${search}${hash}`
               window.location.replace(target)
          } catch (err: any) {
               setError(err?.message || "Could not continue sign in")
          }
          // searchParams is intentionally unused at runtime — keeping the
          // dependency makes the linter happy if we add query-driven logic later.
          void searchParams
     }, [searchParams])

     return (
          <Box
               sx={{
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: "url('/flutter.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    py: 6,
                    px: 2,
               }}
          >
               <Container maxWidth="sm">
                    <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                         <Stack spacing={2} alignItems="center">
                              <Typography variant="h5" component="h1" fontWeight={600} textAlign="center">
                                   Finishing sign in
                              </Typography>
                              {error ? (
                                   <Alert severity="error" data-testid="callback-error">
                                        {error}
                                   </Alert>
                              ) : (
                                   <CircularProgress />
                              )}
                         </Stack>
                    </Paper>
               </Container>
          </Box>
     )
}

export default function CallbackPage() {
     return (
          <Suspense fallback={null}>
               <CallbackHandler />
          </Suspense>
     )
}
