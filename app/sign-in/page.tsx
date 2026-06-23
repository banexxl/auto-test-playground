"use client"
import React, { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
     Alert,
     Box,
     Button,
     CircularProgress,
     Container,
     Link as MuiLink,
     Paper,
     Stack,
     TextField,
     Typography,
} from "@mui/material"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

function isValidEmail(value: string) {
     return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
}

function SignInPage() {
     const router = useRouter()
     const searchParams = useSearchParams()
     const redirectTo = searchParams.get("redirect") || "/"

     const [email, setEmail] = useState("")
     const [password, setPassword] = useState("")
     const [error, setError] = useState<string | null>(null)
     const [notice, setNotice] = useState<string | null>(null)
     const [loading, setLoading] = useState(false)

     // If the user already has an active session, skip the form and redirect.
     useEffect(() => {
          const supabase = createClient()
          supabase.auth.getUser().then(({ data }) => {
               if (data.user) router.replace(redirectTo)
          })
     }, [redirectTo, router])

     const handleSignIn = async (e: React.FormEvent) => {
          e.preventDefault()
          setError(null)
          setNotice(null)

          if (!email || !password) {
               setError("Email and password are required")
               return
          }
          if (!isValidEmail(email)) {
               setError("Enter a valid email address")
               return
          }

          setLoading(true)
          try {
               const supabase = createClient()
               const { error } = await supabase.auth.signInWithPassword({ email, password })
               if (error) throw error
               setNotice("Signed in successfully. Redirecting...")
               // Full navigation so the middleware picks up the new cookies.
               window.location.assign(redirectTo)
          } catch (err: any) {
               setError(err?.message || "Sign in failed")
          } finally {
               setLoading(false)
          }
     }

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
                         <Typography variant="h4" component="h1" gutterBottom fontWeight={600} textAlign="center">
                              Sign In
                         </Typography>
                         <Typography variant="body1" sx={{ mb: 3 }} textAlign="center" color="text.secondary">
                              Access your automation playground account
                         </Typography>

                         <form
                              onSubmit={handleSignIn}
                              noValidate
                         >
                              <Stack spacing={2}>
                                   {error && (
                                        <Alert severity="error" data-testid="signin-error">
                                             {error}
                                        </Alert>
                                   )}
                                   {notice && (
                                        <Alert severity="success" data-testid="signin-success">
                                             {notice}
                                        </Alert>
                                   )}
                                   <>
                                        <TextField
                                             label="Email"
                                             type="email"
                                             fullWidth
                                             autoComplete="email"
                                             value={email}
                                             onChange={(e) => setEmail(e.target.value)}
                                             required
                                             data-testid="email-input"
                                        />
                                        <TextField
                                             label="Password"
                                             type="password"
                                             fullWidth
                                             autoComplete="current-password"
                                             value={password}
                                             onChange={(e) => setPassword(e.target.value)}
                                             required
                                             data-testid="password-input"
                                        />
                                        <Button
                                             type="submit"
                                             variant="contained"
                                             size="large"
                                             disabled={loading}
                                             data-testid="signin-submit"
                                             sx={{ py: 1.2, fontWeight: 600 }}
                                        >
                                             {loading ? <CircularProgress size={26} sx={{ color: "white" }} /> : "Sign In"}
                                        </Button>
                                   </>
                              </Stack>
                         </form>
                    </Paper>
               </Container>
          </Box>
     )
}

export default function SignInPageWithSuspense() {
     return (
          <Suspense fallback={null}>
               <SignInPage />
          </Suspense>
     )
}
