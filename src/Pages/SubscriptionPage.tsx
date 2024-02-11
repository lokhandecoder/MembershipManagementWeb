import React from 'react'
import LayoutComponent from '../Components/Fixed/LayoutComponent'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Pagination, Paper, Select, Snackbar, Switch, TextField } from '@mui/material';
import SubscriptionUtility from '../utilities/SubscriptionUtility';
import GenericTable from '../Components/Fixed/GenericTable';

export default function SubscriptionPage() {

  const { handleDelete, handleEdit, snack, transformedData, handleClickOpen, open, handleClose, memberOptions } = SubscriptionUtility();

  return (
    <LayoutComponent>
      <>
        <div style={{ display: 'flex', padding: 20, alignItems: 'center' }}>
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
            <DialogTitle style={{ textAlign: 'center', paddingBottom: '25px' }}><b>Make Payment</b></DialogTitle>
            <DialogContent>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: 'center' }}>

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
                  // value={memberUtility.dob}
                  // onChange={handleDob}
                  InputLabelProps={{
                    shrink: true,
                  }}
                // error={!!errors.dob}
                // helperText={errors.dob || ""}
                />

                {/* <FormControl sx={{ minWidth: 250 }} error={!!errors.genderId}>
                  <InputLabel id="select-gender-label">Select Gender</InputLabel>
                  <Select
                    labelId="select-gender-label"
                    id="select-gender"
                    // value = {memberUtility.genderId}
                    label="Select Gender"
                    // onChange={handleGenderId}
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
                </FormControl> */}

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label htmlFor="isActive" style={{ marginRight: '10px' }}>Active:</label>
                  <Switch
                    id="isActive"
                    name="isActive"
                    checked={true}
                    // value={memberOptions[0].isActive}
                    // onChange={handleFormChange}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions style={{ paddingTop: '35px' }}>
              <Button onClick={handleClose} variant='contained'>Cancel</Button>
              <Button type="submit" variant='contained' style={{ marginRight: 15 }}
                // onClick={handleSave}
              >Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <GenericTable data={transformedData} onEdit={handleEdit} onDelete={handleDelete} onPay={handleClickOpen} />

        {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px', alignItems: 'center' }}>
          <Pagination count={Math.ceil(totalRows / pageSize)} variant="outlined" shape="rounded" onChange={handlePageChange} />
          <>Total Members = {totalRows}</>
        </div> */}
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
  )
}
