"use client"
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material"
import { useRouter } from "next/navigation"
import { Formik, Form, Field, type FormikHelpers } from "formik"
import * as Yup from "yup"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { createOrder } from "@/lib/slices/orderSlice"
import { clearCart } from "@/lib/slices/cartSlice"
import toast from "react-hot-toast"

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  zipCode: string
}

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .required("Last name is required"),
  email: Yup.string().email("Please enter a valid email address").required("Email is required"),
  address: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must not exceed 100 characters")
    .required("Address is required"),
  city: Yup.string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters")
    .required("City is required"),
  zipCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)")
    .required("ZIP code is required"),
})

export default function CheckoutPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { items, total } = useAppSelector((state) => state.cart)
  const { loading, error } = useAppSelector((state) => state.order)

  const initialValues: CustomerInfo = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  }

  const handleSubmit = async (values: CustomerInfo, { setSubmitting }: FormikHelpers<CustomerInfo>) => {
    try {
      const orderData = {
        items,
        total: total * 1.08, // Including tax
        customerInfo: values,
      }

      const result = await dispatch(createOrder(orderData))

      if (createOrder.fulfilled.match(result)) {
        dispatch(clearCart())
        router.push(`/store/orders`)
      }
    } catch (error) {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Button href="/store" variant="contained">
          Continue Shopping
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }} >
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Shipping Information
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }} data-testid="checkout-error">
                {error}
              </Alert>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Field name="firstName">
                        {() => (
                          <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.firstName && !!errors.firstName}
                            helperText={touched.firstName && errors.firstName ? errors.firstName : ""}
                            data-testid="checkout-first-name"
                            required
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Field name="lastName">
                        {() => (
                          <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName && !!errors.lastName}
                            helperText={touched.lastName && errors.lastName ? errors.lastName : ""}
                            data-testid="checkout-last-name"
                            required
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Field name="email">
                        {() => (
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && !!errors.email}
                            helperText={touched.email && errors.email ? errors.email : ""}
                            data-testid="checkout-email"
                            required
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Field name="address">
                        {() => (
                          <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.address && !!errors.address}
                            helperText={touched.address && errors.address ? errors.address : ""}
                            data-testid="checkout-address"
                            required
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }} >
                      <Field name="city">
                        {() => (
                          <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.city && !!errors.city}
                            helperText={touched.city && errors.city ? errors.city : ""}
                            data-testid="checkout-city"
                            required
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }} >
                      <Field name="zipCode">
                        {() => (
                          <TextField
                            fullWidth
                            label="ZIP Code"
                            name="zipCode"
                            value={values.zipCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.zipCode && !!errors.zipCode}
                            helperText={touched.zipCode && errors.zipCode ? errors.zipCode : ""}
                            data-testid="checkout-zip"
                            required
                          />
                        )}
                      </Field>
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting || loading}
                    sx={{ mt: 3 }}
                    data-testid="place-order-button"
                  >
                    {isSubmitting || loading ? <CircularProgress size={24} /> : "Place Order"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>

            <List>
              {items.map((item) => (
                <ListItem key={item.id} data-testid={`checkout-item-${item.id}`}>
                  <ListItemAvatar>
                    <Avatar src={item.image} variant="square" />
                  </ListItemAvatar>
                  <ListItemText primary={item.title} secondary={`Qty: ${item.quantity} × $${item.price.toFixed(2)}`} />
                  <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography data-testid="checkout-subtotal">${total.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Tax:</Typography>
              <Typography data-testid="checkout-tax">${(total * 0.08).toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" data-testid="checkout-total">
                ${(total * 1.08).toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
