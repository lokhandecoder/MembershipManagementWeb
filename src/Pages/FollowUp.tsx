import React, { useEffect, useState } from "react";
import LayoutComponent from "../Components/Fixed/LayoutComponent";
import GenericTable from "../Components/Fixed/GenericTable";
import { Member } from "../Models/MemberModel";
import {
  FilterDto,
  FollowUpAction,
  FollowUpModel,
} from "../Models/FollowUpModel";
import {
  GetFollowUpAction,
  GetFollowUpBasedOnFilter,
  GetFollowUpById,
  GetFollowUps,
} from "../Services/FollowUpService";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  TextField,
  makeStyles,
} from "@mui/material";
import { Await } from "react-router-dom";
import { idText } from "typescript";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import useCustomSnackbar from "../Components/useCustomSnackbar";
import { error, log } from "console";
import { all } from "axios";
import FollowUpUtility from "../Utilities/FollowUpUtility";
import { DateField } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
const FollowUp: React.FC = () => {
 
  const {
    followUpUtility,
    setFollowUpUtility,
    handleFollowUpActionChange,
    handleNoteChange,
    handleFollowUpDate,
    handleNextFollowUpDate,
    handleMemberChange,
    handleActionClick,
    handleSave,
    handleSearch,selectedMemebrId, page, limit,open,
    handleClickOpen,handleEditClick,handlePageChange,handleClose,
    setFilterDto,filterDto,transformedData,alldata,MemberOptions,optiondata,followUpAction,pageCount,snack,errors,followUp
  } = FollowUpUtility();

  
  return (
    <LayoutComponent>
      <div style={{ display: "flex", padding: 20, alignItems: "center" }}>
        <Autocomplete
          options={MemberOptions}
          value={
            MemberOptions.find((member) => member.id === followUp?.memberId) ||
            undefined
          }
          getOptionLabel={(member) => member.firstName}
          onChange={(event, newValue) => {
            setFilterDto((previous) => ({
              ...previous,
              memberId: newValue ? newValue.id : null,
            }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select a member" variant="outlined" />
          )}
        />

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={optiondata.map((followup) => followup.followUpDate)} // replace with your data source
          sx={{ width: 250 }}
          renderInput={(params) => (
            <TextField {...params} label="Search FollowUpDate" />
          )}
          onChange={(event, newValue) => {
            setFilterDto((previous) => ({
              ...previous,
              followUpDate: newValue || null,
            }));
          }}
          style={{ paddingLeft: 20 }}
        />

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={optiondata.map((followup) => followup.nextFollowUpDate)} // replace with your data source
          sx={{ width: 250 }}
          renderInput={(params) => (
            <TextField {...params} label="Search NextFollowUpDate" />
          )}
          onChange={(event, newValue) => {
            setFilterDto((previous) => ({
              ...previous,
              nextFollowUpDate: newValue || null,
            }));
          }}
          style={{ paddingLeft: 20 }}
        />
        <Button
          variant="outlined"
          onClick={() => handleSearch()}
          style={{ marginLeft: 20, height: "50px" }}
        >
          Search
        </Button>

        <Button
          variant="outlined"
          onClick={handleClickOpen}
          style={{ marginLeft: "35rem", height: "50px" }}
        >
          Add FollowUp
        </Button>
      </div>
      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            handleClose();
          },
        }}
      >
        <DialogTitle>FollowUp Details</DialogTitle>

        <DialogContent style={{ padding: "rem" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.memberId}>
              <Autocomplete 
                fullWidth
                options={MemberOptions}
                value={
                  MemberOptions.find(
                    (member) => member.id === followUp?.memberId
                  ) || undefined
                }
                onChange={handleMemberChange}
                sx={{ width: "100%" }}
                getOptionLabel={(option) => option.firstName}
                renderInput={(params) => (
                  <TextField {...params} label="Select Member" error = {!!errors.memberId} />
                  // <TextField {...params} label={ <span style={{ color: !!errors.memberId ? 'red' : 'inherit' }}>memberId</span> } />
                )}
              />
              {!!errors.memberId && (
                    <FormHelperText sx={{ color: 'red' }}>{errors.memberId}</FormHelperText>
                  )}
            </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.followUpActionId}
>
                <InputLabel id="followUpActionId">FollowUp Action</InputLabel>
                <Select
                  labelId="followUpActionId"
                  id="followUpActionId"
                  value={followUpUtility.followUpActionId}
                  label="FollowUp Action"
                  onChange={handleFollowUpActionChange}
                >
                  {followUpAction?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.followUpActionName}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.followUpActionId && (
                    <FormHelperText sx={{ color: 'red' }}>{errors.followUpActionId}</FormHelperText>
                  )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-multiline-static"
                name="Note"
                label="Note"
                type="text"
                fullWidth
                error={!!errors.note}
                helperText = {errors.note || ""}
                variant="outlined"
                multiline
                rows={4}
                onChange={handleNoteChange}
                value={followUpUtility.note}
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateField"]}>
                  <DatePicker 
                    // label="FollowUp Date"
                    label={ <span style={{ color: !!errors.followUpDate ? 'red' : 'inherit' }}> FollowUp Date </span> }
                    format="DD/MM/YYYY"
                    value={followUpUtility.followUpDate ? dayjs(followUpUtility.followUpDate) : null}
                    onChange={handleFollowUpDate}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </DemoContainer>
                {!!errors.followUpDate && (
                    <FormHelperText sx={{ color: 'red' }}>{errors.followUpDate}</FormHelperText>
                  )}
              </LocalizationProvider>
            </Grid>

            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateField"]}>
                  <DatePicker 
                   // label="FollowUp Date"
                    label={ <span style={{ color: !!errors.nextFollowUpDate ? 'red' : 'inherit' }}> NextFollowUp Date </span> }
                    format="DD/MM/YYYY"
                    value={followUpUtility.nextFollowUpDate ? dayjs(followUpUtility.nextFollowUpDate) : null}
                    //value={followUpUtility.nextFollowUpDate ? followUpUtility.nextFollowUpDate:null}
                    onChange={handleNextFollowUpDate}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </DemoContainer>
                {!!errors.nextFollowUpDate && (
                    <FormHelperText sx={{ color: 'red' }}>{errors.nextFollowUpDate}</FormHelperText>
                  )}
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <GenericTable
        data={transformedData}
        onEditClick={handleEditClick}
        onActionClick={handleActionClick}
      ></GenericTable>
      {/* <button onClick={() => { setPage((prevPage) => Math.max(prevPage - 1, 1)); fetchData(); }}>Previous Page</button>
<span> Page {page} </span>
<button onClick={() => { setPage((prevPage) => prevPage + 1); fetchData(); }}>Next Page</button> */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          count={Math.ceil(pageCount / limit)}
          variant="outlined"
          shape="rounded"
          onChange={handlePageChange}
        />
        <label>Total FollowUp = {pageCount}</label>
      </div>
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

export default FollowUp;
