import React from 'react'
import LayoutComponent from '../Components/Fixed/LayoutComponent'
import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputAdornment, Snackbar, TextField } from '@mui/material';
import SubscriptionUtility from '../utilities/SubscriptionUtility';
import GenericTable from '../Components/Fixed/GenericTable';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'; 
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import utc from "dayjs/plugin/utc"; 
import dayjs, { Dayjs } from "dayjs";

export default function SubscriptionPage() {

  const { dialogTitle, handleDelete, setGst, handleInputChange, memberOptions, handleEndDate, handleBalanceAmount, handleDateChange, filteredMembers, handleEdit, handlecgst, handlesgst, handleTotalAmount, snack, handleAutocompleteMember, handleAutocompletePlan, handleDiscount, handlePaidAmount, payErrors, handleSave, handleStartDate, transformedData, handleClickOpen, handleClickPay, subscriptionUtility, open, openSub, handleCloseSub, handleClose, handlePayment, planOptions, paymentDetails, errors, handlePay, data, getplancost } = SubscriptionUtility();
  const today = dayjs();
  const amount = transformedData.map((data)=> parseInt(data.balance, 10))
 
  return (
    <LayoutComponent>
      <>
        <div style={{ display: 'flex', padding: 20, alignItems: 'center' }}>
          <Button variant="contained" onClick={handleClickOpen} style={{ marginLeft: 'auto', height: '40px' }}>
            <b>Add Subscription</b>
          </Button>
          <Dialog
            open={openSub}
            onClose={handleCloseSub}
            PaperProps={{
              component: 'form',
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleCloseSub();
              }
            }}
          >
            <DialogTitle style={{ textAlign: 'center', paddingBottom: '25px' }}><b>{dialogTitle}</b></DialogTitle>
            <DialogContent>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: 'center', paddingTop: '10px'}}>
                
                <Autocomplete
                  value={subscriptionUtility.memberId ? memberOptions.find(member => member.id === subscriptionUtility.memberId)?.firstName || null : null}
                  options={filteredMembers ? filteredMembers.map(member => member.firstName) : []}
                  sx={{ width: 250 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Search Member" error={!!errors.memberId} helperText={errors.memberId || ""} onChange={handleInputChange} />
                  )}
                  onChange={handleAutocompleteMember}
                />

                <Autocomplete
                  value={planOptions.find((plan) => plan.id === subscriptionUtility.planId) || null}
                  onChange={handleAutocompletePlan}
                  options={planOptions}
                  sx={{ width: 250 }}
                  getOptionLabel={(option) => option.planName}
                  renderInput={(params) => <TextField {...params} label="Select Plan" error={!!errors.planId} helperText={errors.planId || ""}/>}
                />

                <TextField
                  autoFocus
                  sx={{ cursor: 'pointer'}}
                  autoComplete='off'
                  id="name"
                  name="startdate"
                  label="Start Date"
                  type="date"
                  value={subscriptionUtility.startDate}
                  onChange={handleStartDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.startDate}
                  helperText={errors.startDate || ""}
                />

                <TextField
                  autoFocus
                  sx={{ cursor: 'pointer'}}
                  autoComplete='off'
                  id="name"
                  name="endDate"
                  label="End Date"
                  type="date"
                  value={subscriptionUtility.endDate}
                  onChange={handleEndDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.endDate}
                  helperText={errors.endDate || ""}
                />

                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <FormControl fullWidth error={!!errors.startDate}>
                      <DatePicker
                        label="Start Date"
                        // minDate={startDateFinancialYear ? dayjs(startDateFinancialYear) : undefined}
                        // maxDate={endDateFinancialYear ? dayjs(endDateFinancialYear) : undefined}
                        // shouldDisableDate={(date) =>
                        //   isWeekend(date) || isPublicHoliday(date.toDate())
                        // }
                        value={
                          subscriptionUtility.startDate
                            ? dayjs.utc(subscriptionUtility.startDate)
                            : today
                        }
                        onChange={(date) => {
                          if (date) {
                            handleDateChange("startDate", date.toDate());
                          }
                        }}
                      />
                      {!!errors.startDate && (
                        <FormHelperText>{errors.startDate}</FormHelperText>
                      )}
                    </FormControl>
                  </DemoContainer>
                </LocalizationProvider> */}

                <TextField
                  autoFocus
                  sx={{ cursor: 'pointer'}}
                  autoComplete='off'
                  id="name"
                  name="planCost"
                  label="Plan Cost"
                  type="number"
                  disabled
                  value={getplancost()}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                
                <TextField
                  autoFocus
                  sx={{ cursor: 'pointer'}}
                  autoComplete='off'
                  id="name"
                  name="gst"
                  label="GST (%)"
                  type="number"
                  value={subscriptionUtility.gst}
                  onChange={setGst}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  autoFocus
                  sx={{ cursor: 'pointer'}}
                  autoComplete='off'
                  id="name"
                  name="cgst"
                  label="CGST"
                  type="number"
                  disabled
                  value={handlecgst()}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  autoFocus
                  sx={{ cursor: 'pointer'}}
                  autoComplete='off'
                  id="name"
                  name="sgst"
                  label="SGST"
                  type="number"
                  disabled
                  value={handlesgst()}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  id="name"
                  name="amount"
                  label="Discount Amount"
                  type="number"
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                  }}
                  value={subscriptionUtility.discountAmount || ''}
                  onChange={handleDiscount}
                  // error={!!errors.discountAmount}
                  // helperText={errors.discountAmount || undefined}
                />

                <TextField
                  autoFocus
                  sx={{ cursor: 'pointer'}}
                  autoComplete='off'
                  id="name"
                  name="totalAmount"
                  label="Total Amount"
                  type="number"
                  disabled
                  value={handleTotalAmount()}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  id="name"
                  name="amount"
                  label="Paid Amount"
                  type="number"
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                  }}
                  value={subscriptionUtility.paidAmount || ''}
                  onChange={handlePaidAmount}
                  error={!!errors.paidAmount}
                  helperText={errors.paidAmount || undefined}
                />

                <TextField
                  id="name"
                  name="amount"
                  label="Balance Amount"
                  type="number"
                  fullWidth
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={handleBalanceAmount()}
                />

              </div>
            </DialogContent>
            <DialogActions style={{ paddingTop: '35px' }}>
              <Button onClick={handleCloseSub} variant='contained' color='secondary'>Cancel</Button>
              <Button type="submit" variant='contained' style={{ marginRight: 15 }}
                onClick={handleSave}
              >Save
              </Button>
            </DialogActions>
          </Dialog>
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
                <>
                  <p><b>User: </b>{data.UserName.toUpperCase()}</p>
                  <p><b>Member: </b>{data.MemberName.toUpperCase()}</p>
                  <p><b>Plan: </b>{data.PlanName.toUpperCase()}</p>
                  <p><b>Balance Amount: </b>{data.BalanceCost.toFixed(2)}</p>
                  {/* <p><b>Payment Date: </b>{paymentDetails.PaymentDate}</p> */}
                </>

                <TextField
                  id="name"
                  name="amount"
                  label="Payment Amount"
                  type="number"
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                  }}
                  value={paymentDetails.PaymentAmount}
                  onChange={handlePayment}
                  error={!!payErrors.PaymentAmount}
                  helperText={payErrors.PaymentAmount || undefined}
                />

              </div>
            </DialogContent>
            <DialogActions style={{ paddingTop: '35px' }}>
              <Button onClick={handleClose} variant='contained'>Cancel</Button>
              <Button type="submit" variant='contained' style={{ marginRight: 15 }}
                onClick={handlePay}
              >Pay
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <GenericTable data={transformedData} onEdit={handleEdit} onDelete={handleDelete} onPay={handleClickPay} amount={amount}/>

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
