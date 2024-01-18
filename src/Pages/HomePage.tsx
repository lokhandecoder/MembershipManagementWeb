import React from "react";
import LayoutComponent from "../Components/Fixed/LayoutComponent";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import ProfileImage from "../Components/HomePageComponents/ProfileImage";
import ProfileInfo from "../Components/HomePageComponents/ProfileInfo";
import MemberSubscriptions from "../Components/HomePageComponents/MemberSubscriptions";
import MemberPayments from "../Components/HomePageComponents/MemberPayments";
import MemberFollowUp from "../Components/HomePageComponents/MemberFollowUp";
import { normalize } from "path";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
function HomePage() {
  return (
    <LayoutComponent>
      <Grid container spacing={2} sx={{ mt: 2, paddingRight: 4 }}>
        <Grid item xs={4}>
          <ProfileImage />
        </Grid>
        <Grid item xs={8}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <ProfileInfo />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2} gap={1} sx={{ mt: 2, paddingRight: 4 }}>
        <Grid item xs={12}>
          <MemberSubscriptions />
        </Grid>
        <Grid item xs={12}>
          <MemberPayments />
        </Grid>
        <Grid item xs={12}>
          <MemberFollowUp />
        </Grid>
      </Grid>
    </LayoutComponent>
  );
}

export default HomePage;
