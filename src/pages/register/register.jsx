import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import React from "react";
import { registerSchema } from "../../utils/validation";
import { createUser } from "../../service/apiUrl";
import { Link, useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

const Register = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: registerSchema,
    initialValues: {
      fullname: "",
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    const response = await createUser(values);
    const { success } = response || {};
    if (success) {
      navigate("/login");
    }
  };

  const areErrorsPresent = Object.keys(formik.errors).length > 0;
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="fullname"
                  name="fullname"
                  required
                  fullWidth
                  id="fullname"
                  label="Full name"
                  error={formik.touched.fullname && formik.errors.fullname}
                  {...formik.getFieldProps("fullname")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={formik.touched.email && formik.errors.email}
                  {...formik.getFieldProps("email")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  error={formik.touched.password && formik.errors.password}
                  {...formik.getFieldProps("password")}
                />
              </Grid>
              <Typography
                variant="caption"
                color="error"
                fontSize={15}
                style={{ marginLeft: "34%", marginTop: "5%" }}
              >
                {areErrorsPresent && " ALL FIELDS WITH * ARE REQUIRED"}
              </Typography>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
