import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
import { Toaster } from "react-hot-toast"
import theme from "./theme"
import AuthNavWrapper from "@/components/AuthNavWrapper"
import { AuthProvider } from "@/components/AuthProvider"
import ReduxProvider from "@/components/ReduxProvider"

export const metadata: Metadata = {
  title: "Test Automation Playground",
  description: "A comprehensive playground for learning test automation with React and Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{
        minHeight: "100vh",
        backgroundImage: "url('/flutter.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        backgroundColor: "#fafafa",
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        backgroundAttachment: "fixed",
        color: "#fff"
      }}>
        <ReduxProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthProvider>
                <AuthNavWrapper />
                <main>{children}</main>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#363636",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    },
                    success: {
                      style: {
                        background: "#4caf50",
                      },
                      iconTheme: {
                        primary: "#fff",
                        secondary: "#4caf50",
                      },
                    },
                    error: {
                      style: {
                        background: "#f44336",
                      },
                      iconTheme: {
                        primary: "#fff",
                        secondary: "#f44336",
                      },
                    },
                  }}
                />
              </AuthProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
