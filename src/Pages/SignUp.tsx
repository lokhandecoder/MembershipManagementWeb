import React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SignUpUtility from "../utilities/SignUpUtility";
import { Alert, Snackbar } from "@mui/material";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit">
        MembershipManagement
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
  const {handleFirstName, handleLastName, handleMobileNumber, handleEmail, handlePassword, handleSubmit, errors, snack, formData} = SignUpUtility();

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
          {/* <Avatar
            src={avatarImage}
            sx={{ m: 1, bgcolor: "secondary.main", width: 200, height: 200 }}
          /> */}

          <Typography component="h1" variant="h6">
            Register to Membership Management
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="off"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  onChange={handleFirstName}
                  autoFocus
                  error={!!errors.firstName}
                  helperText={errors.firstName || ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="off"
                  onChange={handleLastName}
                  error={!!errors.lastName}
                  helperText={errors.lastName || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete='off'
                  fullWidth
                  id="mobileNo"
                  name="mobileNo"
                  label="Mobile Number"
                  type="number"
                  value={formData.mobileNumber !== undefined ? formData.mobileNumber : ''}
                  onChange={handleMobileNumber}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber || undefined}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  onChange={handleEmail}
                  error={!!errors.emailAddress}
                  helperText={errors.emailAddress || ""}
                  name="email"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  onChange={handlePassword}
                  id="password"
                  error={!!errors.password}
                  helperText={errors.password || ""}
                  autoComplete="off"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                Already have an account?
                <Link href="/login" variant="body2" style={{marginLeft: '5px', fontSize: '16px'}}>
                  Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      <Snackbar
        open={snack.open}
        autoHideDuration={snack.duration}
        onClose={snack.handleSnackbarClose}
        anchorOrigin={snack.position}
      >
        <Alert
          onClose={snack.handleSnackbarClose}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}