import React, { useEffect, useState } from 'react';
import LayoutComponent from '../Components/Fixed/LayoutComponent';
import GenericTable from '../Components/Fixed/GenericTable';
import { AddMembers, DeleteMemberById, GetAllGenders, GetAllMemberByGenderId, GetAllMembers, GetMemberBasedOnFilter, GetMembers, UpdateMembers } from '../Services/MembersServices';
import { FilterDto, Gender, Member } from '../Models/MemberModel';
import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, Snackbar, Switch, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const MembersForm: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [members, setMembersData] = useState<Member[]>([]);
  const [selectedMemberData, setSelectedMemberData] = useState<Member | null>(null);
  const [genderOptions, setGenderOptions] = useState<Gender[]>([]);
  const [selectedGenderId, setSelectedGenderId] = useState<number | 0>(0);
  const [selectedGenderIdDialog, setSelectedGenderIdDialog] = useState<number | 0>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [newMemberData, setNewMemberData] = useState<Member>({
    id: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    mobileNumber: 0,
    address: '',
    dob: '',
    genderId: 0,
    isActive: true,
  });
  const [filterDto, setFilterDto] = useState<FilterDto>({
    genderId: 0,
    firstName: null,
    emailAddress: null,
    mobileNumber: 0,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSearch = async () => {
    try {
      // setFilterDto((prevFilterDto) => ({ ...prevFilterDto, genderId: selectedGenderId }));
      filterDto.genderId = selectedGenderId;
      if(filterDto.genderId !== 0 || filterDto.firstName !== null || filterDto.emailAddress !== null || filterDto.mobileNumber !== 0){
        const membersData = await GetMemberBasedOnFilter(filterDto, currentPage, pageSize);
        setMembersData(membersData);
        fetchDataByGender(Number(selectedGenderId));
      }else{
        fetchData();
      }
      // const membersData = await GetMemberBasedOnFilter(filterDto, currentPage, pageSize);
      // setMembersData(membersData);
      // fetchDataByGender(Number(selectedGenderId));

    } catch (error: any) {
      console.error("Error fetching data:", error);
      showSnackbar(`${error.response?.data || 'Error occurred'}`);
    }
  }

  const fetchData = async () => {
    try {
      const genderdata = await GetAllGenders();
      setGenderOptions(genderdata);
      if (!selectedGenderId) {
        const membersData = await GetMembers(currentPage, pageSize);
        fetchAllData();
        setMembersData(membersData)

      }else{
        const membersData = await GetMemberBasedOnFilter(filterDto, currentPage, pageSize);
        setMembersData(membersData);
        fetchDataByGender(Number(selectedGenderId));
      }
     
      // const membersData = await GetAllMembers()
    } catch (error: any) {
      console.error("Error fetching data:", error);
      showSnackbar(`${error.response?.data || 'Error occurred'}`);
    }
  };

  const fetchAllData = async () => {
    const alldata = await GetAllMembers();
    console.log("A;;", alldata.length)
    setTotalRows(alldata.length);
  };

  const fetchDataByGender = async (genderId: number) => {
    const alldata = await GetAllMemberByGenderId(genderId);
    setTotalRows(alldata.length);
  };

  useEffect(() => {
    if (selectedRowIndex !== null && open) {
      const selectedMember = members[selectedRowIndex];
      setSelectedMemberData(selectedMember);
    }
    fetchData();
  }, [currentPage, pageSize, selectedRowIndex, open]);


  const handleDelete = async (index: number) => {
    try {
      const memberIdToDelete = members[index].id;
      await DeleteMemberById(memberIdToDelete);
      showSnackbar('Member deleted successfully');
      fetchData();
    } catch (error: any) {
      console.error("Error deleting member:", error);
      showSnackbar(`${error.response?.data || 'Error occurred'}`);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
    // alert(selectedGenderId)
    // let memberbygender = members.filter((item) => item.genderId === selectedGenderId);
    // setMembersData(memberbygender);
    // fetchDataByGender(selectedGenderId); // Fetch data for the new page with the current filter

  };
  const getGenderNameById = (genderId: number): string => {
    const selectedGender = genderOptions.find((gender) => gender.id === genderId);
    return selectedGender ? selectedGender.genderName : '';
  };

  // const handleAutocompleteChange = (event: React.ChangeEvent<{}>, newValue: string | null) => {
  // setSearchTerm(newValue || '');
  // setFilterDto((previous) => ({...previous, firstName: newValue}))
  // };

  // const filteredMembers = members.filter((member) =>
  //   member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   member.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   member.mobileNumber.toString().includes(searchTerm),
  // );

  const transformedData = members.map(({ id, genderId, ...rest }) => ({
    ...rest,
    gender: getGenderNameById(genderId),
  }));

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedMemberData(null);
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
  };

  const handleSave = async () => {
    console.log("Gender", selectedGenderIdDialog);
    try {
      if (selectedRowIndex != null) {
        newMemberData.genderId = selectedGenderIdDialog;
        const updatedMember = await UpdateMembers(newMemberData.id, newMemberData);
        console.log('Updated Member:', updatedMember);
        showSnackbar('Member updated successfully');
      } else {
        const isDuplicate = members.some(
          (member) =>
            member.emailAddress.toLowerCase() === newMemberData.emailAddress.toLowerCase() ||
            member.mobileNumber === newMemberData.mobileNumber
        );

        if (isDuplicate) {
          console.log('Error message set:', errorMessage);
          setErrorMessage('Email or Mobile Number already exists');
          return;
        } else {
          newMemberData.genderId = selectedGenderIdDialog;
          const addmember = await AddMembers(newMemberData);
          console.log("Added", addmember);
          showSnackbar('Member added successfully');
        }
        setErrorMessage('');
      }

      setOpen(false);
      setEditMode(false);
      fetchData();
    } catch (error: any) {
      console.error("Error saving data:", error.response?.data);
      setOpen(true);
      showSnackbar(`Error Occurred: ${error.response?.data || 'Unknown error'}`);
    }
  };

  const handleEdit = (index: number) => {
    if (index !== null) {
      const selectedMember = members[index];
      setOpen(true);
      setEditMode(true);
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
      setSelectedRowIndex(index);
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
      <div style={{ display: 'flex', padding: 20, alignItems: 'center' }}>
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
          onChange={(event, newValue) => {
            setFilterDto((previous) => ({ ...previous, firstName: newValue }));
          }}
          style={{ paddingLeft: 20 }}
        />

        <Autocomplete
          disablePortal
          options={transformedData.map((member) => member.emailAddress)}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Search Email" />}
          onChange={(event, newValue) => {
            setFilterDto((previous) => ({ ...previous, emailAddress: newValue }));
          }}
          style={{ paddingLeft: 20 }}
        />

        <Autocomplete
          disablePortal
          options={transformedData.map((member) => String(member.mobileNumber))}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Search Mobile No." />}
          onChange={(event, newValue) => {
            setFilterDto((previous) => ({ ...previous, mobileNumber: Number(newValue) }));
          }}
          style={{ paddingLeft: 20 }}
        />

        <Button variant="contained" onClick={() => handleSearch()} style={{ marginLeft: 20, height: '40px' }}>
          Search
        </Button>

        <Button variant="contained" onClick={() => handleClickOpen()} style={{ marginLeft: 350, height: '40px' }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: 'center' }}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="firstName"
                label="First Name"
                type="text"
                variant="filled"
                value={newMemberData.firstName}
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
                value={newMemberData.lastName}
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
                value={newMemberData.emailAddress}
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
                value={newMemberData.mobileNumber}
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
                value={newMemberData.address}
                onChange={(e) => setNewMemberData({ ...newMemberData, address: e.target.value })}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="DOB"
                  value={newMemberData.dob ? dayjs(newMemberData.dob) : null}
                  onChange={(date) => setNewMemberData({
                    ...newMemberData,
                    dob: date ? dayjs(date).format('YYYY-MM-DD') : '',
                  })} />
              </LocalizationProvider>

              <Autocomplete
                // value={editMode ? (genderOptions.find((gender) => gender.id === newMemberData.genderId) || null) : (genderOptions.find((gender) => gender.id === selectedGenderIdDialog) || null)}
                value={genderOptions.find((gender) => gender.id === selectedGenderIdDialog) || null}
                onChange={(event, newValue) => {
                  setSelectedGenderIdDialog(newValue ? newValue.id : 0);
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

              <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>

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
        <Alert onClose={handleSnackbarClose} sx={{ color: 'black' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </LayoutComponent>
  );
};

export default MembersForm;
