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

type Mode = "sign-in" | "forgot" | "update"

function isValidEmail(value: string) {
     return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
}

function SignInPage() {
     const router = useRouter()
     const searchParams = useSearchParams()
     const redirectTo = searchParams.get("redirect") || "/"

     const [mode, setMode] = useState<Mode>("sign-in")
     const [email, setEmail] = useState("")
     const [password, setPassword] = useState("")
     const [newPassword, setNewPassword] = useState("")
     const [confirmPassword, setConfirmPassword] = useState("")
     const [error, setError] = useState<string | null>(null)
     const [notice, setNotice] = useState<string | null>(null)
     const [loading, setLoading] = useState(false)

     // If the user already has an active session, skip the form and redirect.
     useEffect(() => {
          const supabase = createClient()
          supabase.auth.getUser().then(({ data }) => {
               if (data.user && mode === "sign-in") router.replace(redirectTo)
          })
     }, [redirectTo, router, mode])

     const switchMode = (next: Mode) => {
          setMode(next)
          setError(null)
          setNotice(null)
     }

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

     const handleForgot = async (e: React.FormEvent) => {
          e.preventDefault()
          setError(null)
          setNotice(null)

          if (!email) {
               setError("Enter your account email")
               return
          }
          if (!isValidEmail(email)) {
               setError("Enter a valid email address")
               return
          }

          setLoading(true)
          try {
               const supabase = createClient()
               const redirectToEmail = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                    "/sign-in?mode=update"
               )}`
               const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: redirectToEmail,
               })
               if (error) throw error
               setNotice(
                    "If that email is registered, a password reset link has been sent. Check your inbox."
               )
          } catch (err: any) {
               // Avoid leaking which emails are registered; show a generic success
               // when Supabase returns an "user not found"-style error.
               const message = err?.message || ""
               if (/user.*not.*found|email.*not.*confirm/i.test(message)) {
                    setNotice(
                         "If that email is registered, a password reset link has been sent. Check your inbox."
                    )
               } else {
                    setError(message || "Could not send reset email")
               }
          } finally {
               setLoading(false)
          }
     }

     const handleUpdatePassword = async (e: React.FormEvent) => {
          e.preventDefault()
          setError(null)
          setNotice(null)

          if (!newPassword) {
               setError("Enter a new password")
               return
          }
          if (newPassword.length < 6) {
               setError("Password must be at least 6 characters")
               return
          }
          if (newPassword !== confirmPassword) {
               setError("Passwords do not match")
               return
          }

          setLoading(true)
          try {
               const supabase = createClient()
               const { error } = await supabase.auth.updateUser({ password: newPassword })
               if (error) throw error
               setNotice("Password updated. Redirecting...")
               // Sign out so the user re-authenticates with the new password and
               // the middleware cookie set is fresh.
               await supabase.auth.signOut()
               window.location.assign("/sign-in")
          } catch (err: any) {
               setError(err?.message || "Could not update password")
          } finally {
               setLoading(false)
          }
     }

     const title = mode === "forgot" ? "Reset Password" : mode === "update" ? "Set New Password" : "Sign In"
     const subtitle =
          mode === "forgot"
               ? "Enter your email and we'll send a reset link"
               : mode === "update"
                    ? "Choose a new password for your account"
                    : "Access your automation playground account"

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
                              {title}
                         </Typography>
                         <Typography variant="body1" sx={{ mb: 3 }} textAlign="center" color="text.secondary">
                              {subtitle}
                         </Typography>

                         <form
                              onSubmit={
                                   mode === "forgot" ? handleForgot : mode === "update" ? handleUpdatePassword : handleSignIn
                              }
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

                                   {mode === "sign-in" && (
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
                                             <Typography variant="body2" textAlign="center" color="text.secondary">
                                                  <MuiLink
                                                       component={Link}
                                                       href="#"
                                                       onClick={(e) => {
                                                            e.preventDefault()
                                                            switchMode("forgot")
                                                       }}
                                                       data-testid="forgot-password-link"
                                                  >
                                                       Forgot password?
                                                  </MuiLink>
                                             </Typography>
                                        </>
                                   )}

                                   {mode === "forgot" && (
                                        <>
                                             <TextField
                                                  label="Email"
                                                  type="email"
                                                  fullWidth
                                                  autoComplete="email"
                                                  value={email}
                                                  onChange={(e) => setEmail(e.target.value)}
                                                  required
                                                  data-testid="forgot-email-input"
                                             />
                                             <Button
                                                  type="submit"
                                                  variant="contained"
                                                  size="large"
                                                  disabled={loading}
                                                  data-testid="forgot-submit"
                                                  sx={{ py: 1.2, fontWeight: 600 }}
                                             >
                                                  {loading ? (
                                                       <CircularProgress size={26} sx={{ color: "white" }} />
                                                  ) : (
                                                       "Send Reset Link"
                                                  )}
                                             </Button>
                                             <Typography variant="body2" textAlign="center" color="text.secondary">
                                                  <MuiLink
                                                       component={Link}
                                                       href="#"
                                                       onClick={(e) => {
                                                            e.preventDefault()
                                                            switchMode("sign-in")
                                                       }}
                                                       data-testid="back-to-signin"
                                                  >
                                                       Back to sign in
                                                  </MuiLink>
                                             </Typography>
                                        </>
                                   )}

                                   {mode === "update" && (
                                        <>
                                             <TextField
                                                  label="New Password"
                                                  type="password"
                                                  fullWidth
                                                  autoComplete="new-password"
                                                  value={newPassword}
                                                  onChange={(e) => setNewPassword(e.target.value)}
                                                  required
                                                  data-testid="new-password-input"
                                             />
                                             <TextField
                                                  label="Confirm Password"
                                                  type="password"
                                                  fullWidth
                                                  autoComplete="new-password"
                                                  value={confirmPassword}
                                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                                  required
                                                  data-testid="confirm-password-input"
                                             />
                                             <Button
                                                  type="submit"
                                                  variant="contained"
                                                  size="large"
                                                  disabled={loading}
                                                  data-testid="update-password-submit"
                                                  sx={{ py: 1.2, fontWeight: 600 }}
                                             >
                                                  {loading ? (
                                                       <CircularProgress size={26} sx={{ color: "white" }} />
                                                  ) : (
                                                       "Update Password"
                                                  )}
                                             </Button>
                                        </>
                                   )}
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
