import React, { useEffect, useState } from 'react'
import LayoutComponent from '../Components/Fixed/LayoutComponent'
import GenericTable from '../Components/Fixed/GenericTable'
import { GetAllGenders, GetAllMemberByGenderId, GetAllMembers, GetMemberByGenderId, GetMembers } from '../Services/MembersServices';
import { Gender, Member } from '../Models/MemberModel';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, InputAdornment, Pagination, Switch, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const MembersForm: React.FC = () => {

  const [members, setMembersData] = useState<Member[]>([]);
  const [genderOptions, setGenderOptions] = useState<Gender[]>([]);
  const [selectedGenderId, setSelectedGenderId] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);

  // useEffect(() => { fetch('http://localhost:8082/api/subscription/getSubscriptionsasync/').then((response) => response.json()).then((data) => setData(data)).catch((error) => console.error('Error fetching Data: ', error)); }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genderdata = await GetAllGenders();
        setGenderOptions(genderdata);

        let membersData;

        if (selectedGenderId) {
          membersData = await GetMemberByGenderId(Number(selectedGenderId), currentPage, pageSize);
          setMembersData(membersData);
          fetchDataByGender(Number(selectedGenderId));
          console.log(membersData.length);
        }
        else {
          membersData = await GetMembers(currentPage, pageSize);
          setMembersData(membersData);
          fetchAllData()
          // console.log(membersData);
        }
      }
      catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    const fetchAllData = async () => {
      const alldata = await GetAllMembers();
      setTotalRows(alldata.length);
      console.log(alldata.length);
    }

    const fetchDataByGender = async (genderId: number) => {
      const alldata = await GetAllMemberByGenderId(genderId);
      setTotalRows(alldata.length);
      console.log(alldata.length);
    }
  }, [selectedGenderId, currentPage, pageSize]);



  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };


  const getGenderNameById = (genderId: number): string => {
    const selectedGender = genderOptions.find((gender) => gender.id === genderId);
    return selectedGender ? selectedGender.genderName : '';
  };


  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleAutocompleteChange = (event: React.ChangeEvent<{}>, newValue: string | null) => {
    setSearchTerm(newValue || '');
  };


  const filteredMembers = members.filter((member) =>
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.mobileNumber.toString().includes(searchTerm)
  );


  const transformedData = filteredMembers.map(({ id, genderId, ...rest }) => ({
    ...rest,
    gender: getGenderNameById(genderId)
  }));


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [newMemberData, setNewMemberData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    mobileNumber: 0,
    address: '',
    dob: new Date(),
    genderId: 0,
    isActive: true,
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;

    if (name === 'dob' && value instanceof Date) {
      setNewMemberData((prevData) => ({
        ...prevData,
        dob: value,
      }));
    } else {
      setNewMemberData((prevData) => ({
        ...prevData,
        [name as string]: value,
      }));
    }
  };


  return (
    <LayoutComponent>

      <div style={{ display: 'flex', padding: 20 }}>
        <Autocomplete
          value={genderOptions.find((gender) => gender.id === selectedGenderId) || null}
          onChange={(event, newValue) => {
            setSelectedGenderId(newValue ? newValue.id : '');
          }}
          options={genderOptions}
          sx={{ width: 250 }}
          getOptionLabel={(option) => option.genderName}
          renderInput={(params) => <TextField {...params} label="Select Gender" />}
        />

        <Autocomplete
          disablePortal
          options={transformedData.map((member) => member.firstName)}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Search FirstName" />}
          onChange={handleAutocompleteChange}
          style={{ paddingLeft: 20 }}
        />

        <Autocomplete
          disablePortal
          options={transformedData.map((member) => member.emailAddress)}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Search Email" />}
          onChange={handleAutocompleteChange}
          style={{ paddingLeft: 20 }}
        />

        <Autocomplete
          disablePortal
          options={transformedData.map((member) => String(member.mobileNumber))}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Search Mobile No." />}
          onChange={handleAutocompleteChange}
          style={{ paddingLeft: 20 }}
        />

        <Button variant="contained" onClick={handleClickOpen} style={{ marginLeft: 445 }}>
          Add Member
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const name = formJson.firstName;
              const email = formJson.email;
              console.log({ "Name": name, "Email": email });
              handleClose();
            },
          }}
        >
          <DialogTitle>Add Member</DialogTitle>
          <DialogContent>
            <div style={{display: "grid", gridTemplateColumns:"1fr 1fr", gap:"20px"}}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="firstName"
                label="First Name"
                type="text"
                variant="filled"
              />

              <TextField
                autoFocus
                margin="dense"
                id="name"
                name="lastName"
                label="Last Name"
                type="text"
                variant="filled"
              />

              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="email"
                label="Email Address"
                type="email"
                variant="filled"
              />

              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="mobileNo"
                label="Mobile Number"
                type="number"
                variant="filled"
              />

              <TextField
                autoFocus
                margin="dense"
                id="name"
                name="address"
                label="Address"
                type="text"
                variant="filled"
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker label="DOB" />
                </DemoContainer>
              </LocalizationProvider>

              <Autocomplete
                value={genderOptions.find((gender) => gender.id === selectedGenderId) || null}
                onChange={(event, newValue) => {
                  setSelectedGenderId(newValue ? newValue.id : '');
                }}
                options={genderOptions}
                sx={{ width: 250 }}
                getOptionLabel={(option) => option.genderName}
                renderInput={(params) => <TextField {...params} label="Select Gender" />}
              />

              <FormControlLabel control={<Switch />} label="IsActive" />

            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant='contained'>Cancel</Button>
            <Button type="submit" variant='contained' style={{marginRight: 15}}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>

      <GenericTable data={transformedData} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px', alignItems: 'center' }}>
        <Pagination count={Math.ceil(totalRows / pageSize)} variant="outlined" shape="rounded" onChange={handlePageChange} />

        <>Total Members = {totalRows}</>
      </div>

    </LayoutComponent>
  )
}

export default MembersForm