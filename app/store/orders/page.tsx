"use client"

import { useEffect, useState } from "react"
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from "@mui/material"
import { CheckCircle, ShoppingBag, Receipt } from "@mui/icons-material"
import Link from "next/link"
import { useAppSelector } from "@/lib/hooks"
import type { Order } from "@/lib/types"
import toast from "react-hot-toast"

export default function OrdersPage() {
  const { currentOrder } = useAppSelector((state) => state.order)
  const [orders, setOrders] = useState<Order[]>([])
  const [showAlert, setShowAlert] = useState(!!currentOrder)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        if (response.ok) {
          const fetchedOrders = await response.json()
          setOrders(
            fetchedOrders.sort(
              (a: Order, b: Order) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
          )
        } else {
          toast.error("Failed to fetch orders")
        }
      } catch (error) {
        toast.error("Error fetching orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          backgroundImage: "url(/flutter.jpg)",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          width: "100vw",
          overflowY: "auto",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: "primary.white" }}>
            Your Orders
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "primary.white", mb: 3 }}>
            Track your purchases, review details, and manage your orders below.
          </Typography>

          {currentOrder && (
            <Alert
              severity="success"
              sx={{
                mb: 4,
                alignItems: "center",
                display: showAlert ? "flex" : "none",
              }}
              icon={<CheckCircle />}
              data-testid="order-success-alert"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setShowAlert(false)}
                  data-testid="clear-order-notification"
                >
                  Dismiss
                </Button>
              }
            >
              <Typography variant="h6" gutterBottom>
                Order Placed Successfully!
              </Typography>
              <Typography variant="body2">
                Your order #{currentOrder.id} has been confirmed and will be processed shortly.
              </Typography>
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography variant="body1" color="text.white" sx={{ mb: 2 }}>
              View and manage all your past orders. You can see details, totals, and shipping information
              for each order placed.
            </Typography>
            <Button
              component={Link}
              href="/store"
              variant="contained"
              startIcon={<ShoppingBag />}
              data-testid="continue-shopping-orders"
              sx={{
                mb: 4,
                color: "#fff",
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              Continue Shopping
            </Button>
          </Box>

          {orders.length === 0 ? (
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
              <Receipt sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No orders yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </Typography>
              <Button
                component={Link}
                href="/store"
                variant="contained"
                size="large"
                data-testid="start-shopping-button"
              >
                Start Shopping
              </Button>
            </Paper>
          ) : (
            <Box sx={{ height: "60vh", overflowY: "auto", pr: 1 }}>
              <Grid container spacing={3}>
                {orders.map((order) => (
                  <Grid size={{ xs: 12 }} key={order.id}>
                    <Card elevation={3} data-testid={`order-card-${order.id}`}>
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="h6" gutterBottom data-testid={`order-id-${order.id}`}>
                              Order #{order.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
                              {new Date(order.created_at).toLocaleTimeString()}
                            </Typography>
                          </Box>
                          <Chip
                            label={order.status.toUpperCase()}
                            color="success"
                            data-testid={`order-status-${order.id}`}
                          />
                        </Box>

                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, md: 8 }}>
                            <Typography variant="h6" gutterBottom>
                              Items Ordered ({order.items.length} items)
                            </Typography>
                            <List>
                              {order.items.map((item) => (
                                <ListItem key={`${order.id}-${item.id}`} data-testid={`order-item-${order.id}-${item.id}`}>
                                  <ListItemAvatar>
                                    <Avatar src={item.image} variant="square" sx={{ width: 60, height: 60 }} />
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={item.title}
                                    secondary={`Quantity: ${item.quantity} × $${item.price.toFixed(2)}`}
                                    sx={{ ml: 2 }}
                                  />
                                  <Typography variant="body1" fontWeight="bold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </Typography>
                                </ListItem>
                              ))}
                            </List>
                          </Grid>

                          <Grid size={{ xs: 12, md: 4 }}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                              <Typography variant="h6" gutterBottom>
                                Shipping Address
                              </Typography>
                              <Typography variant="body2">
                                {order.customerInfo.firstName} {order.customerInfo.lastName}
                              </Typography>
                              <Typography variant="body2">{order.customerInfo.address}</Typography>
                              <Typography variant="body2">
                                {order.customerInfo.city}, {order.customerInfo.zipCode}
                              </Typography>
                              <Typography variant="body2">{order.customerInfo.email}</Typography>

                              <Divider sx={{ my: 2 }} />

                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2">Subtotal:</Typography>
                                <Typography variant="body2">${(order.total / 1.08).toFixed(2)}</Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2">Tax:</Typography>
                                <Typography variant="body2">
                                  ${(order.total - order.total / 1.08).toFixed(2)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6" data-testid={`order-total-${order.id}`}>
                                  {parseFloat(order.total.toString()).toFixed(2)}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    </>
  )
}
