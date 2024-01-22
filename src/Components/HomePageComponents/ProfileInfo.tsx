import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Member } from "../../Models/MemberModel";
import { GetMemberByID } from "../../Services/MembersServices";
import { LogginID } from "../../API_CONFIG";

function ProfileInfo() {
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const userid = LogginID;

    const fetchMember = async () => {
      const data = await GetMemberByID(userid);
      setMember(data);
      console.log(member);
    };
    fetchMember();
  }, []);

  return (
    <>
      {member && (
        <Box sx={{ width: "100%", maxWidth: 500 }}>
          <Typography variant="h4" gutterBottom>
            {`${member.firstName} ${member.lastName}`}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Email: {member.emailAddress}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Mobile Number: {member.mobileNumber}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Address: {member.address}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Date of Birth: {member.dob}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Gender: {member.genderId === 1 ? "Male" : "Female"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Active: {member.isActive ? "Yes" : "No"}
          </Typography>
        </Box>
      )}
    </>
  );
}

export default ProfileInfo;
