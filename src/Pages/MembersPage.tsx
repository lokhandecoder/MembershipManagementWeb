import React, { useEffect, useState } from 'react'
import LayoutComponent from '../Components/Fixed/LayoutComponent'
import GenericTable from '../Components/Fixed/GenericTable'
import { AddMembers, DeleteMemberById, GetAllGenders, GetAllMemberByGenderId, GetAllMembers, GetMemberBasedOnFilter, GetMemberByGenderId, GetMembers, UpdateMembers } from '../Services/MembersServices';
import { FilterDto, Gender, Member } from '../Models/MemberModel';
import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, Snackbar, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Switch from '@mui/material/Switch';
import dayjs from 'dayjs';

// const today = dayjs();

const MembersForm: React.FC = () => {

  const [members, setMembersData] = useState<Member[]>([]);
  const [genderOptions, setGenderOptions] = useState<Gender[]>([]);
  const [selectedGenderId, setSelectedGenderId] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [newMemberData, setNewMemberData] = useState<Member>({
    id: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    mobileNumber: 0,
    address: '',
    dob: '',
    genderId: 1,
    isActive: true,
  });

  const [filterDto, setFilterDto] = useState<FilterDto>({
    genderId: 2,
    firstName: null,
    emailAddress: null,
    mobileNumber: 0
  })
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // useEffect(() => { fetch('http://localhost:8082/api/subscription/getSubscriptionsasync/').then((response) => response.json()).then((data) => setData(data)).catch((error) => console.error('Error fetching Data: ', error)); }, []);

  const fetchData = async () => {
    try {
      const genderdata = await GetAllGenders();
      setGenderOptions(genderdata);

      let membersData;

      if (selectedGenderId) {
        setFilterDto(prevFilterDto => ({ ...prevFilterDto, genderId: selectedGenderId }));
        console.log(filterDto)

        // membersData = await GetMemberByGenderId(Number(selectedGenderId), currentPage, pageSize);
        membersData = await GetMemberBasedOnFilter(filterDto, currentPage, pageSize);
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

  useEffect(() => {
    fetchData()
  }, [selectedGenderId, currentPage, pageSize]);

  const handleDelete = async (index: number) => {
    try {
      const memberIdToDelete = members[index].id;
      await DeleteMemberById(memberIdToDelete);
      showSnackbar('Member deleted successfully');
      fetchData();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };

  const getGenderNameById = (genderId: number): string => {
    const selectedGender = genderOptions.find((gender) => gender.id === genderId);
    return selectedGender ? selectedGender.genderName : '';
  };

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

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;

    if (name === 'isActive') {
      setIsActive((event.target as HTMLInputElement).checked);
    } else {
      setNewMemberData((prevData) => ({
        ...prevData,
        [name as string]: value,
      }));
    }
    console.log(newMemberData);
  };

  const handleSave = async () => {
    try {
      if (selectedRowIndex !== null) {
        const updatedMember = await UpdateMembers(newMemberData.id, newMemberData);
        console.log('Updated Member:', updatedMember);
        showSnackbar('Member updated successfully');
        fetchData();
      } else {
        const addmember = await AddMembers(newMemberData)
        console.log("Added", addmember)
        showSnackbar('Member added successfully');
      }
      setOpen(false);
    }
    catch (error) {
      console.error("Error saving data:", error);
    }
  }

  const handleEdit = (index: number) => {
    if (index !== null) {
      const selectedMember = members[index];
      setOpen(true);
      setNewMemberData({
        id: selectedMember.id,
        firstName: selectedMember.firstName,
        lastName: selectedMember.lastName,
        emailAddress: selectedMember.emailAddress,
        mobileNumber: selectedMember.mobileNumber,
        address: selectedMember.address,
        dob: selectedMember.dob ? dayjs(selectedMember.dob).format('YYYY-MM-DD') : '',
        genderId: selectedMember.genderId,
        isActive: selectedMember.isActive,
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setNewMemberData({
      id: '',
      firstName: '',
      lastName: '',
      emailAddress: '',
      mobileNumber: 0,
      address: '',
      dob: '',
      genderId: 1,
      isActive: true,
    });
    setSelectedRowIndex(null);
  };



  return (
    <LayoutComponent>

      <div style={{ display: 'flex', padding: 20 }}>
        <Autocomplete
          value={genderOptions.find((gender) => gender.id === selectedGenderId) || null}
          onChange={(event, newValue) => {
            setSelectedGenderId(newValue ? newValue.id : 0);
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

        <Button variant="contained" onClick={() => handleClickOpen()} style={{ marginLeft: 445 }}>
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
              handleClose();
            }
          }}
        >
          <DialogTitle>Add Member</DialogTitle>
          <DialogContent>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="firstName"
                label="First Name"
                type="text"
                variant="filled"
                onChange={(e) => setNewMemberData({ ...newMemberData, firstName: e.target.value })}
              />

              <TextField
                autoFocus
                margin="dense"
                id="name"
                name="lastName"
                label="Last Name"
                type="text"
                variant="filled"
                onChange={(e) => setNewMemberData({ ...newMemberData, lastName: e.target.value })}
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
                onChange={(e) => setNewMemberData({ ...newMemberData, emailAddress: e.target.value })}
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
                onChange={(e) => setNewMemberData({ ...newMemberData, mobileNumber: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })}
              />

              <TextField
                autoFocus
                margin="dense"
                id="name"
                name="address"
                label="Address"
                type="text"
                variant="filled"
                onChange={(e) => setNewMemberData({ ...newMemberData, address: e.target.value })}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="DOB"
                    value={newMemberData.dob ? dayjs(newMemberData.dob) : null}
                    onChange={(date) => setNewMemberData({
                      ...newMemberData,
                      dob: date ? dayjs(date).format('YYYY-MM-DD') : '',
                    })} />
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

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label htmlFor="isActive" style={{ marginRight: '10px' }}>Active:</label>
                <Switch
                  id="isActive"
                  name="isActive"
                  checked={isActive}
                  onChange={handleFormChange}
                />
              </div>

            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant='contained'>Cancel</Button>
            <Button type="submit" variant='contained' style={{ marginRight: 15 }} onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>

      <GenericTable data={transformedData} onEdit={handleEdit} onDelete={handleDelete} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px', alignItems: 'center' }}>
        <Pagination count={Math.ceil(totalRows / pageSize)} variant="outlined" shape="rounded" onChange={handlePageChange} />

        <>Total Members = {totalRows}</>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ backgroundColor: '#4CAF50', color: '#FFF' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
    </LayoutComponent>
  )
}

export default MembersForm