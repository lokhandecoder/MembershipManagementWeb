import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { Member } from "../Models/MemberModel";
import useCustomSnackbar from "../Components/useCustomSnackbar";
import {
  CreateSubscription,
  DeleteSubscriptionById,
  GetPlans,
  GetSubscription,
  Payment,
  UpdateSubscription,
} from "../Services/SubscriptionService";
import {
  AddSubscriptionModel,
  PlanModel,
  SubscriptionModel,
} from "../Models/SubscriptionModel";
import { GetAllMembers, GetMemberFilter } from "../Services/MembersServices";
import { OnPayModel, PaymentModel } from "../Models/PaymentModel";
import { UserById } from "../Services/UserServices";
import dayjs from "dayjs";
import { AutocompleteChangeReason } from "@mui/material";

const SubscriptionUtility = () => {
  const userid = sessionStorage.getItem("userId");

  const initialPaymentDetails: PaymentModel = {
    UserId: "" || null,
    MemberId: "",
    SubscriptionId: "",
    PaymentDate: "",
    PaymentAmount: undefined,
  };
  const [paymentDetails, setPaymentDetails] = useState<PaymentModel>(
    initialPaymentDetails
  );
  const [subscriptionUtility, setSubscriptionUtility] =
    useState<AddSubscriptionModel>({
      userId: "",
      planId: "",
      memberId: "",
      startDate: "",
      endDate: "",
      gst: 0,
      discountAmount: 0 || undefined,
      paidAmount: 0 || undefined,
    });
  const [open, setOpen] = useState<boolean>(false);
  const [openSub, setOpenSub] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>("Add Subscription");
  const [errors, setErrors] = useState<
    Partial<Record<keyof AddSubscriptionModel, string | null>>
  >({});
  const [payErrors, setPayErrors] = useState<
    Partial<Record<keyof PaymentModel, string | null>>
  >({});
  const [subsData, setSubsData] = useState<SubscriptionModel[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [balanceAmount, setBalanceAmount] = useState<number>(0);
  const [memberOptions, setMemberOptions] = useState<Member[]>([]);
  const [planOptions, setPlanOptions] = useState<PlanModel[]>([]);
  const [data, setData] = useState<OnPayModel>({
    UserName: "",
    MemberName: "",
    PlanName: "",
    BalanceCost: 0,
  });
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [newgst, setGST] = useState<number>(0);

  const snack = useCustomSnackbar();

  const fetchData = async () => {
    try {
      const memberData = await GetAllMembers();
      setMemberOptions(memberData);

      const planData = await GetPlans();
      setPlanOptions(planData);

      const subscriptionData = await GetSubscription();
      setSubsData(subscriptionData);

    } catch (error: any) {
      console.error("Error fetching data:", error);
      snack.showSnackbar(
        `${error.response?.data || "Error occurred"}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
  };

  useEffect(() => {
    fetchData();
    if (subscriptionUtility.startDate) {
      handleEndDate({ target: { value: subscriptionUtility.startDate }} as React.ChangeEvent<HTMLInputElement>);
    }
    if (subsData && selectedRowIndex !== null && subsData[selectedRowIndex]) {
      const initialGstValue = subsData[selectedRowIndex].gst;
      setGST(initialGstValue * 0.01);
    }
  }, [subscriptionUtility.startDate, selectedRowIndex]);

  const getPlanNameById = (planId: string): string => {
    const selectedPlan = planOptions.find((plan) => plan.id === planId);
    return selectedPlan ? selectedPlan.planName : "";
  };

  const getMemberNameById = (memberId: string): string => {
    const selectedMember = memberOptions.find(
      (member) => member.id === memberId
    );
    return selectedMember ? selectedMember.firstName : "";
  };

  const transformedData = subsData.map(
    ({
      id,
      planId,
      memberId,
      cgst,
      sgst,
      gst,
      totalAmount,
      balanceAmount,
      discountAmount,
      costAfterDiscount,
      paidAmount,
      planCost,
      startDate,
      endDate,
      ...rest
    }) => ({
      ...rest,
      member: getMemberNameById(memberId),
      plan: getPlanNameById(planId),
      startDate: startDate,
      endDate: endDate,
      planCost: planCost,
      discount: discountAmount,
      cost: costAfterDiscount,
      gst: gst,
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      totalcost: totalAmount.toFixed(2),
      paid: paidAmount,
      balance: balanceAmount.toFixed(2),
    })
  );

  const handleClickOpen = () => {
    setOpenSub(true);
    setDialogTitle("Add Subscription");
    setSubscriptionUtility({
      userId: userid,
      planId: "",
      memberId: "",
      startDate: "",
      endDate: "",
      gst: 0,
      discountAmount: 0 || undefined,
      paidAmount: 0 || undefined,
    });
    setSelectedRowIndex(null);
  };

  const handleEdit = (index: number | null) => {
    // console.log("api data", subsData)
    if (index !== null) {
      const selectedSubscription = subsData[index];
      // console.log("GST......", selectedSubscription)
      setOpenSub(true);
      setDialogTitle("Update Subscription");
      // setSubscriptionUtility(selectedSubscription)
      setSubscriptionUtility({
        userId: userid,
        planId: selectedSubscription.planId,
        memberId: selectedSubscription.memberId,
        startDate: selectedSubscription.startDate,
        endDate: selectedSubscription.endDate,
        gst: selectedSubscription.gst,
        discountAmount: selectedSubscription.discountAmount,
        paidAmount: selectedSubscription.paidAmount,
      });
      setSelectedRowIndex(index);
    }
  };

  const isFormDataValid = (formData: AddSubscriptionModel) => {
    const newErrors: Partial<Record<keyof AddSubscriptionModel, string>> = {};
    if (formData.memberId === "") {
      newErrors.memberId = "Please select Member";
    }
    if (formData.planId === "") {
      newErrors.planId = "Please select Plan";
    }
    if (formData.startDate === "") {
      newErrors.startDate = "Please select StartDate";
    }
    if (formData.endDate === "") {
      newErrors.endDate = "Please select EndDate";
    }
    // if (!formData.discountAmount) {
    //   newErrors.discountAmount = `Please enter a valid discount amount.`;
    // }
    const isValid = Object.keys(newErrors).length === 0;
    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue.length >= 1) {
      try {
        const response = await GetMemberFilter(newValue);
        setFilteredMembers(response);
      } catch (error) {
        console.error("Error fetching filtered members data:", error);
      }
    } else {
      setFilteredMembers([]);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    let val;
    // console.log(errors)
    // console.log(subscriptionUtility);
    // console.log(subscriptionUtility.startDate, subscriptionUtility.endDate)

    try {
      if (selectedRowIndex != null) {
        if (!isFormDataValid(subscriptionUtility)) {
          val = true;
          // console.log(val);
        } else {
          const selectedSubscription = subsData[selectedRowIndex];
          const updatedSubscription = await UpdateSubscription(
            selectedSubscription.id,
            subscriptionUtility
          );
          console.log("Updated Subscription:", updatedSubscription);
          snack.showSnackbar(
            `${"Subscription updated successfully"}`,
            "success",
            { vertical: "top", horizontal: "center" },
            5000
          );
          val = false;
          fetchData();
        }
        setOpenSub(val);
      } else {
        if (!isFormDataValid(subscriptionUtility)) {
          val = true;
          // console.log(subscriptionUtility);
          // console.log(errors)
          // console.log(val)
        } else {
          console.log("AddSubscription");
          const addsubscription = await CreateSubscription(subscriptionUtility);
          console.log("Added", addsubscription);
          snack.showSnackbar(
            `${"Subscription added successfully"}`,
            "success",
            { vertical: "top", horizontal: "center" },
            5000
          );
          // const makePayment = await Payment()
          val = false;
          fetchData();
        }
        setOpenSub(val);
      }
    } catch (error: any) {
      console.error("Error saving data:", error.response?.data);
      setOpen(true);
      snack.showSnackbar(
        `Error Occurred: ${error.response?.data || "Unknown error"}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
  };

  const handleClickPay = async (index: number) => {
    setOpen(true);
    const selectedSubscription = subsData[index];

    const userData = await UserById(userid);
    setData((prev) => ({
      ...prev,
      UserName: `${userData.firstName} ${userData.lastName}`,
    }));

    const selectedMember = memberOptions.find(
      (member) => member.id === selectedSubscription.memberId
    );
    setData((prev) => ({
      ...prev,
      MemberName: selectedMember
        ? `${selectedMember.firstName} ${selectedMember.lastName}`
        : "",
    }));

    const selectedplan = planOptions.find(
      (plan) => plan.id === selectedSubscription.planId
    );
    setData((prev) => ({
      ...prev,
      PlanName: selectedplan ? `${selectedplan.planName}` : "",
      BalanceCost: selectedSubscription.balanceAmount,
    }));

    setPaymentDetails({
      UserId: userid,
      MemberId: selectedSubscription.memberId,
      SubscriptionId: selectedSubscription.id,
      PaymentDate: dayjs().format("YYYY-MM-DD"),
      PaymentAmount: 0,
    });
    setSelectedRowIndex(null);
  };

  const handleCloseSub = () => {
    setOpenSub(false);
    setErrors({
      discountAmount: undefined,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setPayErrors({
      PaymentAmount: undefined,
    });
  };

  const isPayFormDataValid = (formData: PaymentModel) => {
    const newErrors: Partial<Record<keyof PaymentModel, string>> = {};
    if (!formData.PaymentAmount || formData.PaymentAmount > data.BalanceCost) {
      newErrors.PaymentAmount = `Please enter a valid payment amount. Max amount entered can be ${data.BalanceCost}`;
    }
    const isValid = Object.keys(newErrors).length === 0;
    setPayErrors(newErrors);
    return isValid;
  };

  const handlePay = async (e: any) => {
    e.preventDefault();
    let val;
    try {
      if (!isPayFormDataValid(paymentDetails)) {
        val = true;
      } else {
        const payment = await Payment(paymentDetails);
        console.log("Payed", payment);
        snack.showSnackbar(
          `${"Payment successfull"}`,
          "success",
          { vertical: "top", horizontal: "center" },
          5000
        );
        val = false;
        fetchData();
      }
      setOpen(val);
    } catch (error: any) {
      console.error("Error in payment:", error.response?.data);
      setOpen(true);
      snack.showSnackbar(
        `Error Occurred: ${error.response?.data || "Unknown error"}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
  };

  const handleDelete = async (index: number) => {
    try {
      const subscriptionIdToDelete = subsData[index].id;
      // console.log(subscriptionIdToDelete);
      await DeleteSubscriptionById(subscriptionIdToDelete);
      snack.showSnackbar(
        `Member deleted successfully`,
        "success",
        { vertical: "top", horizontal: "center" },
        5000
      );
      fetchData();
    } catch (error: any) {
      console.error("Error deleting member:", error);
      snack.showSnackbar(
        `${error.response?.data || "Error occurred"}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
  };

  const handlePayment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    const parsedValue = value === "" ? undefined : parseInt(value, 10);
    setPaymentDetails((prev) => ({ ...prev, PaymentAmount: parsedValue }));
    if (!parsedValue || parsedValue > data.BalanceCost) {
      setPayErrors((prevErrors) => ({
        ...prevErrors,
        PaymentAmount: `Please enter a valid payment amount. Max amount entered can be ${data.BalanceCost}`,
      }));
    } else {
      setPayErrors((prevErrors) => ({ ...prevErrors, PaymentAmount: "" }));
    }
  };

  const handleDiscount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    const parsedValue = value === "" ? 0 : parseInt(value, 10);
    setSubscriptionUtility((prev) => ({
      ...prev,
      discountAmount: parsedValue,
    }));
    // if (!parsedValue) {
    //   setErrors((prevErrors) => ({ ...prevErrors, discountAmount: `Please enter a valid discount amount.` }));
    // } else {
    //     setErrors((prevErrors) => ({ ...prevErrors, discountAmount: "" }));
    // }
  };


  const handlePaidAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    const parsedValue = value === "" ? 0 : parseInt(value, 10);
    setSubscriptionUtility((prev) => ({ ...prev, paidAmount: parsedValue }));   
    const totalAmount = handleTotalAmount()
    // if (!parsedValue || parsedValue > Number(totalAmount)) {
    if (parsedValue > Number(totalAmount)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        paidAmount: `Please enter a valid payment amount. Max amount entered can be ${totalAmount}`,
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, paidAmount: "" }));
    }
  };

  const handleStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSubscriptionUtility((prev) => ({ ...prev, startDate: value }));

    handleEndDate(event);

    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        startDate: "Please select StartDate.",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, startDate: "" }));
    }
  };

  // const handleEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   setSubscriptionUtility((prev) => ({ ...prev, endDate: value }));
  //   console.log("hello",planOptions.map((member)=> member.durationTypeId))
  //   if (value === "") {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       endDate: "Please select EndDate.",
  //     }));
  //   } else {
  //     setErrors((prevErrors) => ({ ...prevErrors, endDate: "" }));
  //   }
  // };

  const handleEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSubscriptionUtility((prev) => ({ ...prev, endDate: value }));
  
    const selectedPlan = planOptions.find(option => option.id === subscriptionUtility.planId);
  
    // console.log(subscriptionUtility.startDate, subscriptionUtility.endDate)
    if (value !== "" && subscriptionUtility.startDate && selectedPlan) {
      const startDate = new Date(subscriptionUtility.startDate);
      let endDate = new Date(startDate);
  
      if (selectedPlan.durationTypeId === 1) {
        endDate.setFullYear(startDate.getFullYear() + selectedPlan.planDuration);
      } else if (selectedPlan.durationTypeId === 2) {
        endDate.setMonth(startDate.getMonth() + selectedPlan.planDuration);
      } else if (selectedPlan.durationTypeId === 3) {
        endDate.setDate(startDate.getDate() + selectedPlan.planDuration);
      }
  
      setSubscriptionUtility((prev) => ({ ...prev, endDate: endDate.toISOString().split('T')[0] }));
    }
  
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        endDate: "Please select EndDate.",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, endDate: "" }));
    }
  };
  

  const handleAutocompletePlan = (
    event: React.ChangeEvent<{}>,
    newValue: PlanModel | null
  ) => {
    setSubscriptionUtility((previous) => ({
      ...previous,
      planId: newValue ? newValue.id : "",
    }));
    if (newValue?.id === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        planId: "Please select Plan.",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, planId: "" }));
    }
  };

  const handleAutocompleteMember = (
    event: SyntheticEvent<Element, Event>,
    value: string | null,
    reason: AutocompleteChangeReason
  ) => {

    if (reason === "selectOption" && value !== null) {
      const selectedMember = filteredMembers.find(
        (member) => member.firstName === value
      );
      if (selectedMember) {
        setSubscriptionUtility((previous) => ({
          ...previous,
          memberId: selectedMember.id,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, memberId: "" }));
      } else {
        setSubscriptionUtility((previous) => ({ ...previous, memberId: "" }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          memberId: "Please select Member.",
        }));
      }
    } else {
      setSubscriptionUtility((previous) => ({ ...previous, memberId: "" }));
      setErrors((prevErrors) => ({ ...prevErrors, memberId: "" }));
    }
  };

  function getplancost() {
    const plan =
      planOptions.find((plan) => plan.id === subscriptionUtility.planId) ||
      null;
    return plan?.planCost || 0;
  }

  const setGst = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = event.target.value.trim() === "" ? 0 : parseInt(event.target.value.trim(), 10);
    const valPercent = parsedValue * 0.01;
    setGST(valPercent);
    setSubscriptionUtility((prev) => ({ ...prev, gst: parsedValue }));
  }

  function handlecgst() {
    const amount = getplancost();
    const cgst = newgst === 0 ? 0 : newgst * (amount ? amount - (subscriptionUtility?.discountAmount || 0) : 0);
    return cgst.toFixed(2);
  }

  function handlesgst() {
    const amount = getplancost();
    const sgst = (newgst === 0 ? 0 : (newgst * (amount ? amount - (subscriptionUtility?.discountAmount || 0) : 0)));
    return sgst.toFixed(2);
  }

  function handleTotalAmount() {
    const amount = Number(getplancost());
    const costAfterDiscount = amount - (subscriptionUtility?.discountAmount || 0)
    const cgst = Number(handlecgst());
    const sgst = Number(handlesgst());
    const totalAmount = costAfterDiscount ? costAfterDiscount + cgst + sgst : 0;
    return totalAmount.toFixed(2);
  }

  function handleBalanceAmount() {
    const totalAmount = Number(handleTotalAmount())
    const balanceAmount = totalAmount - (subscriptionUtility?.paidAmount || 0)
    return balanceAmount.toFixed(2);
  }

  const handleDateChange = (name: string, date: Date | null) => {
    setSubscriptionUtility({
      ...subscriptionUtility,
      [name]: date,
    });
  };

  return {
    handleEdit,
    handleDelete,
    handleInputChange,
    filteredMembers,
    snack,
    transformedData,
    handleClickOpen,
    handleClickPay,
    memberOptions,
    planOptions,
    open,
    openSub,
    handleClose,
    handleCloseSub,
    subscriptionUtility,
    handleAutocompleteMember,
    handleAutocompletePlan,
    paymentDetails,
    data,
    handleSave,
    setGst,
    handleDiscount,
    handlePaidAmount,
    errors,
    handleStartDate,
    handleEndDate,
    handleDateChange,
    payErrors,
    dialogTitle,
    handlePayment,
    handleBalanceAmount,
    handlePay,
    handlecgst,
    handlesgst,
    handleTotalAmount,
    getplancost,
  };
};

export default SubscriptionUtility;
