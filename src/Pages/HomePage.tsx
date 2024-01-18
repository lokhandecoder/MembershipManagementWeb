import React from "react";
import LayoutComponent from "../Components/Fixed/LayoutComponent";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ProfileImage from "../Components/HomePageComponents/ProfileImage";
import ProfileInfo from "../Components/HomePageComponents/ProfileInfo";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
function HomePage() {
  return (
    <LayoutComponent>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {/* <Item>xs=8</Item> */
          <ProfileImage />}
        </Grid>
        <Grid item xs={8}>
          <ProfileInfo />
        </Grid>
      </Grid>
    </LayoutComponent>
  );
}

export default HomePage;
