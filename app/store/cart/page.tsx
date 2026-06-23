"use client"
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  IconButton,
  TextField,
  Divider,
  Paper,
} from "@mui/material"
import { Add, Remove, Delete, ShoppingCartCheckout } from "@mui/icons-material"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { updateQuantity, removeFromCart } from "@/lib/slices/cartSlice"

export default function CartPage() {
  const dispatch = useAppDispatch()
  const { items, total, itemCount } = useAppSelector((state) => state.cart)

  const handleQuantityChange = (id: number, newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: Math.max(0, newQuantity) }))
  }

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id))
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.white" >
          Add some products to your cart to get started
        </Typography>
        <Button component={Link} href="/store" variant="contained" size="large" data-testid="continue-shopping">
          Continue Shopping
        </Button>
      </Container>
    )
  }

  return (
    <>
      <Box sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        backgroundImage: 'url(/flutter.jpg)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }} />
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1, minHeight: '100vh', overflowY: 'auto' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Shopping Cart ({itemCount} items)
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            {items.map((item) => (
              <Card key={item.id} sx={{ mb: 2 }} data-testid={`cart-item-${item.id}`}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 3, sm: 2 }}>
                      <CardMedia
                        component="img"
                        image={item.image}
                        alt={item.title}
                        sx={{ height: 80, objectFit: "contain" }}
                        data-testid={`cart-item-image-${item.id}`}
                      />
                    </Grid>
                    <Grid size={{ xs: 9, sm: 4 }}>
                      <Typography variant="h6" data-testid={`cart-item-title-${item.id}`}>
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="primary"
                        fontWeight="bold"
                        data-testid={`cart-item-price-${item.id}`}
                      >
                        ${item.price.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          data-testid={`decrease-quantity-${item.id}`}
                        >
                          <Remove />
                        </IconButton>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 0)}
                          inputProps={{ min: 0, style: { textAlign: "center" } }}
                          sx={{ width: 60 }}
                          data-testid={`quantity-input-${item.id}`}
                        />
                        <IconButton
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          data-testid={`increase-quantity-${item.id}`}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 3, sm: 2 }}>
                      <Typography variant="h6" textAlign="center" data-testid={`cart-item-total-${item.id}`}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 3, sm: 1 }} textAlign="right">
                      <IconButton
                        onClick={() => handleRemoveItem(item.id)}
                        color="error"
                        data-testid={`remove-item-${item.id}`}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ p: 3, position: "sticky", top: 20 }}>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Items ({itemCount}):</Typography>
                <Typography data-testid="cart-subtotal">${total.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>Free</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography data-testid="cart-tax">${(total * 0.08).toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" data-testid="cart-total">
                  ${(total * 1.08).toFixed(2)}
                </Typography>
              </Box>

              <Button
                component={Link}
                href="/store/checkout"
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ShoppingCartCheckout />}
                data-testid="proceed-to-checkout"
              >
                Proceed to Checkout
              </Button>

              <Button
                component={Link}
                href="/store"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                data-testid="continue-shopping-cart"
              >
                Continue Shopping
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
