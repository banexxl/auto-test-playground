"use client"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean | null // null = loading, true / false once known
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const supabase = createClient()

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user ?? null)
    setIsAuthenticated(!!data.user)
  }, [supabase])

  useEffect(() => {
    refresh()
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session?.user)
    })
    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [refresh, supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    // Force a navigation so the middleware re-evaluates the now-cleared cookies.
    window.location.assign("/sign-in")
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
