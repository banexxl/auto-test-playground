"use client"
import type React from "react"
import { TextField, Button, Box, CircularProgress } from "@mui/material"
import { Formik, Form, Field, type FormikHelpers } from "formik"
import * as Yup from "yup"
import toast from "react-hot-toast"

interface FormData {
  username: string
  email: string
  age: number | ""
  bio: string
  salary: number | ""
}

interface Props {
  onSubmitSuccess: () => void
}

// Validation schema using Yup
const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .required("Username is required"),
  email: Yup.string().email("Please enter a valid email address").required("Email is required"),
  age: Yup.number()
    .min(18, "Age must be at least 18")
    .max(100, "Age must not exceed 100")
    .required("Age is required")
    .typeError("Age must be a number"),
  bio: Yup.string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must not exceed 500 characters")
    .required("Bio is required"),
  salary: Yup.number()
    .min(1000, "Salary must be at least $1,000")
    .max(1000000, "Salary must not exceed $1,000,000")
    .required("Salary is required")
    .typeError("Salary must be a number"),
})

const FormValidationComponent: React.FC<Props> = ({ onSubmitSuccess }) => {
  const initialValues: FormData = {
    username: "",
    email: "",
    age: "",
    bio: "",
    salary: "",
  }

  const handleSubmit = async (values: FormData, { setSubmitting, resetForm }: FormikHelpers<FormData>) => {
    const toastId = toast.loading("Submitting form...")

    try {
      const response = await fetch("/api/form-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          age: Number(values.age),
          bio: values.bio,
          salary: Number(values.salary),
        }),
      })

      if (response.ok) {
        toast.success("Form submitted successfully with Formik!", { id: toastId })
        resetForm()
        onSubmitSuccess()
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      toast.error("Failed to submit form. Please try again.", { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <Field name="username">
              {() => (
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && !!errors.username}
                  helperText={
                    touched.username && errors.username
                      ? errors.username
                      : "Must be 3-20 characters (Formik validation)"
                  }
                  margin="normal"
                  data-testid="formik-username-input"
                />
              )}
            </Field>

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
                  helperText={
                    touched.email && errors.email ? errors.email : "Enter a valid email address (Formik validation)"
                  }
                  margin="normal"
                  data-testid="formik-email-input"
                />
              )}
            </Field>

            <Field name="age">
              {() => (
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={values.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.age && !!errors.age}
                  helperText={touched.age && errors.age ? errors.age : "Must be between 18-100 (Formik validation)"}
                  margin="normal"
                  data-testid="formik-age-input"
                />
              )}
            </Field>

            <Field name="bio">
              {() => (
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  value={values.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.bio && !!errors.bio}
                  helperText={
                    touched.bio && errors.bio
                      ? errors.bio
                      : `${values.bio.length}/500 characters (min 10) - Formik validation`
                  }
                  margin="normal"
                  data-testid="formik-bio-input"
                />
              )}
            </Field>

            <Field name="salary">
              {() => (
                <TextField
                  fullWidth
                  label="Salary"
                  name="salary"
                  type="number"
                  value={values.salary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.salary && !!errors.salary}
                  helperText={
                    touched.salary && errors.salary
                      ? errors.salary
                      : "Must be between $1,000 - $1,000,000 (Formik validation)"
                  }
                  margin="normal"
                  data-testid="formik-salary-input"
                />
              )}
            </Field>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
              data-testid="formik-submit-button"
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Submit Form (Formik)"}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default FormValidationComponent
