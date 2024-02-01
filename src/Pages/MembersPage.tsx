import React, { useEffect, useState } from 'react';
import LayoutComponent from '../Components/Fixed/LayoutComponent';
import GenericTable from '../Components/Fixed/GenericTable';
import { AddMembers, DeleteMemberById, GetAllGenders, GetAllMemberByGenderId, GetAllMembers, GetMemberBasedOnFilter, GetMembers, UpdateMembers } from '../Services/MembersServices';
import { FilterDto, Gender, Member } from '../Models/MemberModel';
import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, Snackbar, Switch, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import useCustomSnackbar from '../Components/useCustomSnackbar';
import { log } from 'console';

const MembersForm: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [members, setMembersData] = useState<Member[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [selectedMemberData, setSelectedMemberData] = useState<Member | null>(null);
  const [genderOptions, setGenderOptions] = useState<Gender[]>([]);
  const [selectedGenderId, setSelectedGenderId] = useState<number | 0>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalRows, setTotalRows] = useState<number>(0);
  // const [searchTerm, setSearchTerm] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Member, string>>>({});
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [newMemberData, setNewMemberData] = useState<Member>({
    id: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    mobileNumber: undefined,
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
  const snack = useCustomSnackbar();

  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState('');

  // const handleSnackbarClose = () => setSnackbarOpen(false);

  // const showSnackbar = (message: string) => {
  //   setSnackbarMessage(message);
  //   setSnackbarOpen(true);
  // };

  const isFormDataValid = (formData: Member) => {
    const newErrors: Partial<Record<keyof Member, string>> = {};
    if (formData.firstName.trim() === "") {
      newErrors.firstName = "Please enter a first name.";
    }
    if (formData.lastName.trim() === "") {
      newErrors.lastName = "Please enter a last name.";
    }
    if (formData.dob === "") {
      newErrors.dob = "Please select Date of Birth."
      snack.showSnackbar(
        `${'Please select Date of Birth.'}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
    if (formData.genderId === 0) {
      newErrors.genderId = "Please select Gender"
      snack.showSnackbar(
        `${'Please select Gender'}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
    if (formData.mobileNumber === 0 || formData.mobileNumber === null) {
      newErrors.mobileNumber = "Please enter a mobile number.";
    }
    if (!formData.emailAddress || !/^\S+@\S+\.\S+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address.";
    }

    const isValid = Object.keys(newErrors).length === 0;

    setErrors(newErrors);
    return isValid;
  };

  const handleSearch = async () => {
    try {
      // setFilterDto((prevFilterDto) => ({ ...prevFilterDto, genderId: selectedGenderId }));
      filterDto.genderId = selectedGenderId;
      if (filterDto.genderId !== 0 || filterDto.firstName !== null || filterDto.emailAddress !== null || filterDto.mobileNumber !== 0) {
        const membersData = await GetMemberBasedOnFilter(filterDto, currentPage, pageSize);
        setMembersData(membersData);
        setTotalRows(membersData.length);
        
        fetchDataByGender(Number(selectedGenderId));
      } else {
        fetchData();
      }
      // const membersData = await GetMemberBasedOnFilter(filterDto, currentPage, pageSize);
      // setMembersData(membersData);
      // fetchDataByGender(Number(selectedGenderId));

    } catch (error: any) {
      console.error("Error fetching data:", error);
      // showSnackbar(`${error.response?.data || 'Error occurred'}`);
      snack.showSnackbar(
        `Error Found`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
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

      } else {
        const membersData = await GetMemberBasedOnFilter(filterDto, currentPage, pageSize);
        setMembersData(membersData);
        fetchDataByGender(Number(selectedGenderId));
      }

    } catch (error: any) {
      console.error("Error fetching data:", error);
      // showSnackbar(`${error.response?.data || 'Error occurred'}`);
      snack.showSnackbar(
        `${error.response?.data || 'Error occurred'}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
  };

  const fetchAllData = async () => {
    const alldata = await GetAllMembers();
    setAllMembers(alldata);
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
      // showSnackbar('Member deleted successfully');
      snack.showSnackbar(
        `Member deleted successfully`,
        "success",
        { vertical: "top", horizontal: "center" },
        5000
      );
      fetchData();
    } catch (error: any) {
      console.error("Error deleting member:", error);
      // showSnackbar(`${error.response?.data || 'Error occurred'}`);
      snack.showSnackbar(
        `${error.response?.data || 'Error occurred'}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
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

  const handleSave = async (e: any) => {
    e.preventDefault();
    console.log(newMemberData);
    let val;
    try {
      if (selectedRowIndex != null) {
        if (!isFormDataValid(newMemberData)) {
          console.log("Error");
          val = true;
          console.log(val);
        } else {
          const updatedMember = await UpdateMembers(newMemberData.id, newMemberData);
          console.log('Updated Member:', updatedMember);
          // showSnackbar('Member updated successfully');
          snack.showSnackbar(
            `${'Member updated successfully'}`,
            "success",
            { vertical: "top", horizontal: "center" },
            5000
          );
          val = false;
        }

        setOpen(val);
        fetchData();
      } else {
        if (!isFormDataValid(newMemberData)) {
          console.log("Error");
          val = true;
        } else {
          console.log("AddMember")
          const addmember = await AddMembers(newMemberData);
          console.log("Added", addmember);
          // showSnackbar('Member added successfully');
          snack.showSnackbar(
            `${'Member added successfully'}`,
            "success",
            { vertical: "top", horizontal: "center" },
            5000
          );
          val = false;
          setErrorMessage('');
        }

        setOpen(val);
        fetchData();
      }
    } catch (error: any) {
      // alert(JSON.stringify(error))
      console.error("Error saving data:", error.response?.data);
      setOpen(true);
      // showSnackbar(`Error Occurred: ${error.response?.data || 'Unknown error'}`);
      snack.showSnackbar(
        `Error Occurred: ${error.response?.data || 'Unknown error'}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
  };

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
      console.log(newMemberData.genderId)
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
      mobileNumber: undefined,
      address: '',
      dob: '',
      genderId: 0,
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
            // setFilterDto((previous) => ({ ...previous, genderId: newValue? newValue.id: 0}))
          }}
          options={genderOptions}
          sx={{ width: 250 }}
          getOptionLabel={(option) => option.genderName}
          renderInput={(params) => <TextField {...params} label="Select Gender" />}
        />

        <Autocomplete
          disablePortal
          options={allMembers.map((member) => member.firstName)}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Search FirstName" />}
          onChange={(event, newValue) => {
            setFilterDto((previous) => ({ ...previous, firstName: newValue }));
          }}
          style={{ paddingLeft: 20 }}
        />

        <Autocomplete
          disablePortal
          options={allMembers.map((member) => member.emailAddress)}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Search Email" />}
          onChange={(event, newValue) => {
            setFilterDto((previous) => ({ ...previous, emailAddress: newValue }));
          }}
          style={{ paddingLeft: 20 }}
        />

        <Autocomplete
          disablePortal
          options={allMembers.map((member) => String(member.mobileNumber))}
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
                // required
                autoComplete='off'
                margin="dense"
                id="name"
                name="firstName"
                label="First Name"
                type="text"
                variant="outlined"
                value={newMemberData.firstName}
                onChange={(e) => {
                  setNewMemberData({ ...newMemberData, firstName: e.target.value }); setErrors((prevErrors) => ({ ...prevErrors, firstName: '' }));
                }}
                error={!!errors.firstName}
                helperText={errors.firstName || ""}

              />

              <TextField
                autoFocus
                autoComplete='off'
                margin="dense"
                id="name"
                name="lastName"
                label="Last Name"
                type="text"
                variant="outlined"
                value={newMemberData.lastName}
                onChange={(e) => { 
                  setNewMemberData({ ...newMemberData, lastName: e.target.value }); setErrors((prevErrors) => ({ ...prevErrors, lastName: '' }));
                }}
                error={!!errors.lastName}
                helperText={errors.lastName || ""}
              />

              <TextField
                autoFocus
                // required
                autoComplete='off'
                margin="dense"
                id="name"
                name="email"
                label="Email Address"
                type="email"
                variant="outlined"
                value={newMemberData.emailAddress}
                onChange={(e) => { 
                  setNewMemberData({ ...newMemberData, emailAddress: e.target.value }); setErrors((prevErrors) => ({ ...prevErrors, emailAddress: '' }));
                }}
                error={!!errors.emailAddress}
                helperText={errors.emailAddress || ""}
              />

              <TextField
                autoFocus
                // required
                autoComplete='off'
                margin="dense"
                id="name"
                name="mobileNo"
                label="Mobile Number"
                type="number"
                variant="outlined"
                value={newMemberData.mobileNumber}
                onChange={(e) => { 
                  setNewMemberData({ ...newMemberData, mobileNumber: e.target.value === '' ? 0 : parseInt(e.target.value, 10) }); setErrors((prevErrors) => ({ ...prevErrors, mobileNumber: '' }));
                }}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber || ""}
              />

              <TextField
                autoFocus
                autoComplete='off'
                margin="dense"
                id="name"
                name="address"
                label="Address"
                type="text"
                variant="outlined"
                value={newMemberData.address}
                onChange={(e) => { 
                  setNewMemberData({ ...newMemberData, address: e.target.value }); setErrors((prevErrors) => ({ ...prevErrors, address: '' }));
                }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="DOB"
                  value={newMemberData.dob ? dayjs(newMemberData.dob) : null}
                  onChange={(date) => setNewMemberData({
                    ...newMemberData,
                    dob: date ? dayjs(date).format('YYYY-MM-DD') : '',
                  })}
                  disableFuture />
              </LocalizationProvider>

              <Autocomplete
                value={genderOptions.find((gender) => gender.id === newMemberData.genderId) || null}
                onChange={(event, newValue) => {
                  setNewMemberData({ ...newMemberData, genderId: newValue ? newValue.id : 0 })
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
            <Button type="submit" variant='contained' style={{ marginRight: 15 }} onClick={(e) => handleSave(e)}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>

      <GenericTable data={transformedData} onEdit={handleEdit} onDelete={handleDelete} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px', alignItems: 'center' }}>
        <Pagination count={Math.ceil(totalRows / pageSize)} variant="outlined" shape="rounded" onChange={handlePageChange} />
        <>Total Members = {totalRows}</>
      </div>

      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} sx={{ color: 'black' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar> */}
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
    </LayoutComponent>
  );
};

export default MembersForm;
