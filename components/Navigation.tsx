"use client"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material"
import { ShoppingCart, Receipt, Menu as MenuIcon, Logout, Login } from "@mui/icons-material"
import Link from "next/link"
import Image from "next/image"
import { useAppSelector } from "@/lib/hooks"
import { useAuth } from "./AuthProvider"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Playground", href: "/playground" },
  { label: "Form Validation", href: "/form-validation" },
  { label: "Weather", href: "/weather" },
  { label: "Store", href: "/store" },
]

const Navigation: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, signOut } = useAuth()
  const cartItemCount = useAppSelector((state) => state.cart.itemCount)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleSignInClick = () => {
    const redirect = pathname && pathname !== "/sign-in" ? pathname : "/"
    router.push(`/sign-in?redirect=${encodeURIComponent(redirect)}`)
  }

  const handleSignOutClick = async () => {
    setAccountAnchor(null)
    await signOut()
  }

  const userInitial = (user?.email || "?").charAt(0).toUpperCase()

  return (
    <>
      <AppBar position="static" sx={{ mb: 0 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              component={Link}
              href="/"
              sx={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
            >
              <Image src="/2.svg" alt="Logo" width={40} height={40} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Test Automation Playground
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    color="inherit"
                    component={Link}
                    href={item.href}
                    sx={{
                      backgroundColor: pathname === item.href ? "rgba(255,255,255,0.15)" : "transparent",
                      borderRadius: 1,
                      px: 2,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button
                  color="inherit"
                  component={Link}
                  href="/store/orders"
                  data-testid="orders-button"
                  sx={{
                    backgroundColor: pathname === "/store/orders" ? "rgba(255,255,255,0.15)" : "transparent",
                    borderRadius: 1,
                    minWidth: "auto",
                    p: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <Receipt />
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  href="/store/cart"
                  data-testid="cart-button"
                  sx={{
                    backgroundColor: pathname === "/store/cart" ? "rgba(255,255,255,0.15)" : "transparent",
                    borderRadius: 1,
                    minWidth: "auto",
                    p: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <Badge badgeContent={cartItemCount} color="error" data-testid="cart-badge">
                    <ShoppingCart />
                  </Badge>
                </Button>

                {/* Auth: Sign In button when logged out, account menu when logged in */}
                {isAuthenticated ? (
                  <>
                    <IconButton
                      onClick={(e) => setAccountAnchor(e.currentTarget)}
                      data-testid="account-button"
                      sx={{ ml: 1, p: 0.5 }}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: 14 }}>
                        {userInitial}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={accountAnchor}
                      open={Boolean(accountAnchor)}
                      onClose={() => setAccountAnchor(null)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                      <MenuItem disabled sx={{ opacity: "1 !important", fontSize: 13 }}>
                        {user?.email}
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        onClick={handleSignOutClick}
                        data-testid="signout-button"
                      >
                        <Logout fontSize="small" sx={{ mr: 1 }} />
                        Sign Out
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button
                    color="inherit"
                    onClick={handleSignInClick}
                    data-testid="signin-nav-button"
                    startIcon={<Login />}
                    sx={{
                      ml: 1,
                      borderRadius: 1,
                      px: 2,
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton edge="end" color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.href}
                component={Link}
                href={item.href}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            <Divider />
            <ListItem
              component={Link}
              href="/store/orders"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <Receipt sx={{ mr: 1 }} />
              <ListItemText primary="Orders" />
            </ListItem>
            <ListItem
              component={Link}
              href="/store/cart"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <ShoppingCart sx={{ mr: 1 }} />
              <ListItemText primary="Cart" />
              {cartItemCount > 0 && (
                <Badge badgeContent={cartItemCount} color="error" sx={{ ml: "auto" }} />
              )}
            </ListItem>
            <Divider />
            {isAuthenticated ? (
              <>
                <ListItem disabled sx={{ opacity: "1 !important" }}>
                  <ListItemText
                    primary={user?.email || "Signed in"}
                    primaryTypographyProps={{ fontSize: 13, color: "text.secondary" }}
                  />
                </ListItem>
                <ListItem
                  onClick={handleSignOutClick}
                  data-testid="signout-button-mobile"
                  sx={{ cursor: "pointer", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
                >
                  <Logout sx={{ mr: 1 }} />
                  <ListItemText primary="Sign Out" />
                </ListItem>
              </>
            ) : (
              <ListItem
                component={Link}
                href={`/sign-in?redirect=${encodeURIComponent(pathname || "/")}`}
                onClick={() => setDrawerOpen(false)}
                data-testid="signin-nav-button-mobile"
                sx={{ "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
              >
                <Login sx={{ mr: 1 }} />
                <ListItemText primary="Sign In" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default Navigation
