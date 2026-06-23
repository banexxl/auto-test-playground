"use client"
import React from "react"
import Navigation from "./Navigation"

// Navigation now reads auth state directly from AuthProvider via useAuth(),
// so this wrapper just ensures the provider is mounted above the nav.
export default function AuthNavWrapper() {
  return <Navigation />
}
