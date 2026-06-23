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
} from "@mui/material"
import { CheckCircle, ShoppingBag } from "@mui/icons-material"
import Link from "next/link"
import { useAppSelector } from "@/lib/hooks"
import type { Order } from "@/lib/types"
import toast from "react-hot-toast"

export default function ConfirmationPage({ params }: { params: { orderId: string } }) {
  const { currentOrder } = useAppSelector((state) => state.order)
  const [order, setOrder] = useState<Order | null>(currentOrder)

  useEffect(() => {
    if (!currentOrder) {
      // If no current order in Redux, try to fetch from API
      const fetchOrder = async () => {
        try {
          const response = await fetch(`/api/orders/${params.orderId}`)
          if (response.ok) {
            const orderData = await response.json()
            setOrder(orderData)
          }
        } catch (error) {
          toast.error("Failed to fetch order details")
        }
      }
      fetchOrder()
    }
  }, [currentOrder, params.orderId])

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Order not found
        </Typography>
        <Button component={Link} href="/store" variant="contained">
          Continue Shopping
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />

        <Typography variant="h3" gutterBottom color="success.main">
          Order Confirmed!
        </Typography>

        <Typography variant="h6" color="text.secondary">
          Thank you for your purchase. Your order has been successfully placed.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" gutterBottom>
            Order ID: <strong data-testid="order-id">{order.id}</strong>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Order Date: {new Date(order.createdAt).toLocaleDateString()}
          </Typography>
          <Chip label={order.status.toUpperCase()} color="success" data-testid="order-status" />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom textAlign="left">
          Order Details
        </Typography>

        <Box sx={{ textAlign: "left", mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Shipping Address:
          </Typography>
          <Typography variant="body1">
            {order.customerInfo.firstName} {order.customerInfo.lastName}
          </Typography>
          <Typography variant="body1">{order.customerInfo.address}</Typography>
          <Typography variant="body1">
            {order.customerInfo.city}, {order.customerInfo.zipCode}
          </Typography>
          <Typography variant="body1">{order.customerInfo.email}</Typography>
        </Box>

        <Typography variant="h6" gutterBottom textAlign="left">
          Items Ordered:
        </Typography>

        <List>
          {order.items.map((item) => (
            <ListItem key={item.id} data-testid={`confirmation-item-${item.id}`}>
              <ListItemAvatar>
                <Avatar src={item.image} variant="square" />
              </ListItemAvatar>
              <ListItemText primary={item.title} secondary={`Quantity: ${item.quantity}`} />
              <Typography variant="body1">${(item.price * item.quantity).toFixed(2)}</Typography>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" data-testid="confirmation-total">
            ${order.total.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            component={Link}
            href="/store"
            variant="contained"
            startIcon={<ShoppingBag />}
            data-testid="continue-shopping-confirmation"
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
