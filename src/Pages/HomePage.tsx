import React, { useEffect, useState } from "react";
import LayoutComponent from "../Components/Fixed/LayoutComponent";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ProfileImage from "../Components/HomePageComponents/ProfileImage";
import ProfileInfo from "../Components/HomePageComponents/ProfileInfo";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { GetMembersCount, GetSubscriptionStatus, GetSubscriptionsAmount, GetSubscriptionsBasedonTime, GetSubscriptionsCount, GetSubscriptionsDiscount, GetUsersCount } from "../Services/AllDetailsService";
import { count } from "console";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
function HomePage() {

  const [subsCount, setSubsCount] = useState<number>();
  const [memCount, setMemCount] = useState<number>();
  const [userCount, setUserCount] = useState<number>();
  const [subs, setSubs] = useState({});
  const [amount, setAmount] = useState({});
  const [discount, setDiscount] = useState({});
  const [status, setStatus] = useState({});

  const fetchData = async () => {
    const subscriptionCount = await GetSubscriptionsCount();
    setSubsCount(subscriptionCount);

    const membersCount = await GetMembersCount();
    setMemCount(membersCount);

    const usersCount = await GetUsersCount();
    setUserCount(usersCount);

    const subscriptions = await GetSubscriptionsBasedonTime();
    setSubs(subscriptions);

    const amount = await GetSubscriptionsAmount();
    setAmount(amount);

    const discount = await GetSubscriptionsDiscount();
    setDiscount(discount);

    const status = await GetSubscriptionStatus();
    setStatus(status);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <LayoutComponent>
      <Grid container>
        <Grid item xs={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} style={{ paddingTop: 50 }}>
              <ProfileImage />
            </Grid>
            <Grid item xs={6} style={{ paddingTop: 50 }}>
              <ProfileInfo />
            </Grid>
            <Grid item xs={12} style={{ display: 'flex', paddingTop: 80 }}>
              <Item sx={{ padding: 2 }}>
                <Card sx={{ padding: 2 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Number of Subscriptions
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        {subsCount}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Item>
              <Item sx={{ padding: 2 }}>
                <Card sx={{ padding: 2 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Number of Members
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        {memCount}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Item>
              <Item sx={{ padding: 2 }}>
                <Card sx={{ padding: 2 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Number of Users
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        {userCount}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Item>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <Item sx={{ padding: 2 }}>
                <Card sx={{ padding: 2 }}>
                  <CardActionArea>
                    <CardContent>
                      {subs && Object.entries(subs).map(([key, value]) => (
                        <div key={key}>
                          <Typography gutterBottom variant="body1" component="div">
                            {key} : {typeof value === 'number' ? value : 'N/A'}
                          </Typography>
                        </div>
                      ))}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Item>
              <Item sx={{ padding: 2 }}>
                <Card sx={{ padding: 2 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                         Payment & Subscription Status
                      </Typography>
                      {status && Object.entries(status).map(([key, value]) => (
                        <div key={key}>
                          <Typography gutterBottom variant="body1" component="div">
                            {key} : {typeof value === 'number' ? value : 'N/A'}
                          </Typography>
                        </div>
                      ))}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Item>
              <Item sx={{ padding: 2 }}>
                <Card sx={{ padding: 2 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Amount Recieved
                      </Typography>
                      {amount && Object.entries(amount).map(([key, value]) => (
                        <div key={key}>
                          <Typography gutterBottom variant="body1" component="div">
                            {key} : {typeof value === 'number' ? value : 'N/A'}
                          </Typography>
                        </div>
                      ))}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Item>
              <Item sx={{ padding: 2 }}>
                <Card sx={{ padding: 2 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Discount Given
                      </Typography>
                      {discount && Object.entries(discount).map(([key, value]) => (
                        <div key={key}>
                          <Typography gutterBottom variant="body1" component="div">
                            {key} : {typeof value === 'number' ? value : 'N/A'}
                          </Typography>
                        </div>
                      ))}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </LayoutComponent>
  );
}

export default HomePage;
