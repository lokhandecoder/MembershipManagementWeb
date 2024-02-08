import React, { ChangeEvent, useEffect, useState } from 'react';
import LayoutComponent from '../Components/Fixed/LayoutComponent';
import GenericTable from '../Components/Fixed/GenericTable';
import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Pagination, Paper, Select, SelectChangeEvent, Snackbar, Switch, TextField } from '@mui/material';
import MemberUtility from '../utilities/MemberUtitlity';

const MembersForm: React.FC = () => {

  const {
    memberUtility,
    handleFirstName,
    handleLastName,
    handleEmail,
    handleMobileNumber,
    handleAddress,
    handleDob,
    handleGenderId,
    genderOptions,
    dialogTitle,
    filteredMembers,
    pageSize,
    totalRows,
    isActive,
    open,
    errors,
    filterDto,
    handleSearch,
    handleDelete,
    handlePageChange,
    transformedData,
    handleClose,
    handleFormChange,
    handleEdit,
    handleClickOpen,
    handleInputChange,
    handleSave,
    handleAutocompleteGender,
    handleAutocompleteFirstName,
    handleAutocompleteEmail,
    handleAutocompleteMobile,
    snack,
  } = MemberUtility();

  return (
    <LayoutComponent>
      <>
        <div style={{ display: 'flex', padding: 20, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Autocomplete
              value={genderOptions.find((gender) => gender.id === filterDto.genderId) || null}
              onChange={handleAutocompleteGender}
              options={genderOptions}
              sx={{ width: 250 }}
              getOptionLabel={(option) => option.genderName}
              renderInput={(params) => <TextField {...params} label="Select Gender" />}
            />

            <Autocomplete
              disablePortal
              options={filteredMembers.map((member) => member.firstName)}
              sx={{ width: 250 }}
              renderInput={(params) => (
                <TextField {...params} label="Search FirstName" onChange={handleInputChange} />
              )}
              onChange={handleAutocompleteFirstName}
              style={{ paddingLeft: 20 }}
            />

            <Autocomplete
              disablePortal
              options={filteredMembers.map((member) => member.emailAddress)}
              sx={{ width: 250 }}
              renderInput={(params) => <TextField {...params} label="Search Email" onChange={handleInputChange} />}
              onChange={handleAutocompleteEmail}
              style={{ paddingLeft: 20 }}
            />

            <Autocomplete
              disablePortal
              options={filteredMembers.map((member) => String(member.mobileNumber))}
              sx={{ width: 250 }}
              renderInput={(params) => <TextField {...params} label="Search Mobile No." onChange={handleInputChange} />}
              onChange={handleAutocompleteMobile}
              style={{ paddingLeft: 20 }}
            />

            <Button variant="contained" onClick={() => handleSearch()} style={{ marginLeft: 20, marginRight: 20, height: '40px' }}>
              Search
            </Button>
          </div>

          <Button variant="contained" onClick={() => handleClickOpen()} style={{ marginLeft: 'auto', height: '40px' }}>
            <b>Add Member</b>
          </Button>

          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              component: 'form',
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleClose();
              }
            }}
          >
            <DialogTitle style={{ textAlign: 'center', paddingBottom: '25px' }}><b>{dialogTitle}</b></DialogTitle>
            <DialogContent>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: 'center' }}>
                <TextField
                  autoFocus
                  autoComplete='off'
                  margin="dense"
                  id="name"
                  name="firstName"
                  label="First Name"
                  type="text"
                  variant="outlined"
                  value={memberUtility.firstName}
                  onChange={handleFirstName}
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
                  value={memberUtility.lastName}
                  onChange={handleLastName}
                  error={!!errors.lastName}
                  helperText={errors.lastName || ""}
                />

                <TextField
                  autoFocus
                  autoComplete='off'
                  margin="dense"
                  id="name"
                  name="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={memberUtility.emailAddress}
                  onChange={handleEmail}
                  error={!!errors.emailAddress}
                  helperText={errors.emailAddress || ""}
                />

                <TextField
                  autoFocus
                  autoComplete='off'
                  margin="dense"
                  id="name"
                  name="mobileNo"
                  label="Mobile Number"
                  type="number"
                  variant="outlined"
                  value={memberUtility.mobileNumber !== undefined ? memberUtility.mobileNumber : ''}
                  onChange={handleMobileNumber}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber || undefined}
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
                  value={memberUtility.address}
                  onChange={handleAddress}
                />

                <TextField
                  autoFocus
                  style={{ cursor: 'pointer' }}
                  autoComplete='off'
                  margin="dense"
                  id="name"
                  name="DOB"
                  label="DOB"
                  type="date"
                  variant="outlined"
                  value={memberUtility.dob}
                  onChange={handleDob}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.dob}
                  helperText={errors.dob || ""}
                />
{/* 
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <FormControl sx={{ minWidth: 250 }} error={!!errors.dob} >
                      <DatePicker
                        label={ <span style={{ color: !!errors.dob ? 'red' : 'inherit' }}> DOB </span> }
                        // label= 'DOB'
                        value={newMemberData.dob ? dayjs(newMemberData.dob) : null}
                        onChange={(date) => {
                          setNewMemberData({ ...newMemberData, dob: date ? dayjs(date).format('YYYY-MM-DD') : '', }); 
                          setErrors((prevErrors) => ({ ...prevErrors, dob: '' }));
                        }}
                        
                        // renderInput={(params) => (
                        //   <TextField
                        //     {...params}
                        //     helperText={!!errors.dob ? errors.dob : ''}
                        //     error={!!errors.dob}
                        //   />
                        // )}
                        disableFuture
                      />
                      {!!errors.dob && (
                        <FormHelperText >{errors.dob}</FormHelperText>
                      )}
                    </FormControl>
                  </DemoContainer>
                </LocalizationProvider> */}

                <FormControl sx={{ minWidth: 250 }} error={!!errors.genderId}>
                  <InputLabel id="select-gender-label">Select Gender</InputLabel>
                  <Select
                    labelId="select-gender-label"
                    id="select-gender"
                    // value={genderOptions.find((gender) => gender.id === memberUtility.genderId) || ''}
                    value = {memberUtility.genderId}
                    label="Select Gender"
                    onChange={handleGenderId}
                    // renderValue={(selected) => (selected ? selected.genderName : '')}
                    MenuProps={{
                      PaperProps: {
                        component: Paper,
                      },
                    }}
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.genderName}
                      </MenuItem>
                    ))}
                  </Select>
                  {!!errors.genderId && (
                    <FormHelperText sx={{ color: 'red' }}>{errors.genderId}</FormHelperText>
                  )}
                </FormControl>

                {/* <Autocomplete
                value={genderOptions.find((gender) => gender.id === newMemberData.genderId) || null}
                onChange={(event, newValue) => {
                  setNewMemberData({ ...newMemberData, genderId: newValue ? newValue.id : 0 })
                }}
                options={genderOptions}
                sx={{ width: 250 }}
                getOptionLabel={(option) => option.genderName}
                renderInput={(params) => <TextField {...params} label="Select Gender" />}
                /> */}

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label htmlFor="isActive" style={{ marginRight: '10px' }}>Active:</label>
                  <Switch
                    id="isActive"
                    name="isActive"
                    checked={isActive}
                    value={memberUtility.isActive}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions style={{ paddingTop: '35px' }}>
              <Button onClick={handleClose} variant='contained'>Cancel</Button>
              <Button type="submit" variant='contained' style={{ marginRight: 15 }} onClick={ handleSave }>Save</Button>
            </DialogActions>
          </Dialog>
        </div>

        <GenericTable data={transformedData} onEdit={handleEdit} onDelete={handleDelete} />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px', alignItems: 'center' }}>
          <Pagination count={Math.ceil(totalRows / pageSize)} variant="outlined" shape="rounded" onChange={handlePageChange} />
          <>Total Members = {totalRows}</>
        </div>
      </>

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
