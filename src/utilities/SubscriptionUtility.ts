import { useEffect, useState } from "react";
import { Member } from "../Models/MemberModel";
import useCustomSnackbar from "../Components/useCustomSnackbar";
import { DeleteSubscriptionById, GetPlans, GetSubscription } from "../Services/SubscriptionService";
import { PlanModel, SubscriptionModel } from "../Models/SubscriptionModel";
import { GetAllMembers, GetMemberBasedOnFilter } from "../Services/MembersServices";

const SubscriptionUtility = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [subsData, setSubsData] = useState<SubscriptionModel[]>([])
  const [memberOptions, setMemberOptions] = useState<Member[]>([])
  const [planOptions, setPlanOptions] = useState<PlanModel[]>([])
  
  // const [userOptions, setUserOptions] = useState<UserSignup>({
  //   id: "",
  //   firstName: "",
  //   lastName: "",
  //   emailAddress: "",
  //   mobileNumber: 0 || undefined,
  //   password: "",
  // });

  const snack = useCustomSnackbar()

  const fetchData = async () => {
    try{
      const planData = await GetPlans();
      setPlanOptions(planData);

      const memberData = await GetAllMembers();
      setMemberOptions(memberData)

      const subscriptionData = await GetSubscription();
      setSubsData(subscriptionData);
    }
    catch (error: any) {
      console.error("Error fetching data:", error);
      snack.showSnackbar(
        `${error.response?.data || "Error occurred"}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPlanNameById = (planId: string): string => {
    const selectedPlan = planOptions.find(
      (plan) => plan.id === planId
    );
    return selectedPlan ? selectedPlan.planName : "";
  };

  const getMemberNameById = (memberId: string): string => {
    const selectedMember = memberOptions.find(
      (member) => member.id === memberId
    );
    return selectedMember ? selectedMember.firstName : "";
  };

  const transformedData = subsData.map(({ id, planId, memberId, cgst, sgst, totalAmount, balanceAmount, discountAmount, costAfterDiscount, paidAmount, ...rest }) => ({
    ...rest,
    plan: getPlanNameById(planId),
    member: getMemberNameById(memberId),
    discount: discountAmount,
    cost: costAfterDiscount,
    cgst: cgst.toFixed(2),
    sgst: sgst.toFixed(2),
    totalcost: totalAmount.toFixed(2),
    balancecost: balanceAmount.toFixed(2),
  }));
  
  function handleEdit(index: number): void {
    throw new Error('Function not implemented.');
  }

  const handleClickOpen = () => {
    setOpen(true);
    // setMemberUtility({
    //   id: "",
    //   firstName: "",
    //   lastName: "",
    //   emailAddress: "",
    //   mobileNumber: undefined,
    //   address: "",
    //   dob: "",
    //   genderId: 0,
    //   isActive: true,
    // });
    // setSelectedRowIndex(null);
  };

  const handleClose = () => {
    setOpen(false);
    // setErrors({
    //   firstName: "",
    //   lastName: "",
    //   emailAddress: "",
    //   mobileNumber: undefined,
    // });
  };

  const handleDelete = async (index: number) => {
    try {
      const subscriptionIdToDelete = subsData[index].id;
      console.log(subscriptionIdToDelete)
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

  return {
    handleEdit,
    handleDelete,
    snack,
    transformedData,
    handleClickOpen,
    open,
    handleClose,
    memberOptions,
    // userOptions,
    // subscriptionOptions
  }
}

export default SubscriptionUtility;