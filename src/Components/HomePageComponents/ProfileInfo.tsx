import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Member } from "../../Models/MemberModel";
import { UserById } from "../../Services/UserServices";
import { UserSignup } from "../../Models/UserModel";

function ProfileInfo() {
  const [user, setUser] = useState<UserSignup | null>(null);
  const userid = sessionStorage.getItem("userId");    

  useEffect(() => {

    const fetchMember = async () => {
      const data = await UserById(userid)
      setUser(data);
      console.log(user);
    };
    fetchMember();
  }, []);

  return (
    <>
      {user && (
        <Box sx={{ width: "100%", maxWidth: 500 }}>
          <Typography variant="h4" gutterBottom>
            {`${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Email: {user.emailAddress}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Mobile Number: {user.mobileNumber}
          </Typography>
        </Box>
      )}
    </>
  );
}

export default ProfileInfo;
