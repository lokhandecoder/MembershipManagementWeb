import React, { ChangeEvent, useEffect, useState } from "react";
import { FilterDto, Gender, Member } from "../Models/MemberModel";
import { AutocompleteChangeReason, SelectChangeEvent } from "@mui/material";
import useCustomSnackbar from "../Components/useCustomSnackbar";
import {
  AddMembers,
  DeleteMemberById,
  GetAllGenders,
  GetMemberBasedOnFilter,
  GetMemberFilter,
  UpdateMembers,
} from "../Services/MembersServices";
import dayjs from "dayjs";

const MemberUtility = () => {
  const initialMember: Member = {
    id: "",
    firstName: "",
    lastName: "",
    emailAddress: "",
    mobileNumber: undefined,
    address: "",
    dob: "",
    genderId: 0,
    isActive: true,
  };

  const [memberUtility, setMemberUtility] = useState<Member>(initialMember);
  const [members, setMembersData] = useState<Member[]>([]);
  const [genderOptions, setGenderOptions] = useState<Gender[]>([]);
  const [dialogTitle, setDialogTitle] = useState<string>("Add Member");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Member, string | null>>>({});
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [filterDto, setFilterDto] = useState<FilterDto>({
    genderId: 0,
    firstName: null,
    nameMemberId: null,
    emailMemberId: null,
    numberMemberId: null,
    emailAddress: null,
    mobileNumber: 0,
  });
  const snack = useCustomSnackbar();

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
    }
    if (formData.genderId === 0) {
      newErrors.genderId = "Please select Gender"
    }
    if (!formData.mobileNumber || !/^\d{10}$/.test(String(formData.mobileNumber))) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number.";
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
      // alert(JSON.stringify(filterDto));
      setCurrentPage(1);
      fetchData();
    } catch (error: any) {
      console.error("Error fetching data:", error);
      snack.showSnackbar(
        `Error Found`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
  };

  const fetchData = async () => {
    try {
      const genderdata = await GetAllGenders();
      setGenderOptions(genderdata);
      const membersData = await GetMemberBasedOnFilter(
        filterDto,
        currentPage,
        pageSize
      );
      // console.log(membersData);
      setMembersData(membersData.members);
      setTotalRows(membersData.totalCount);
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
  }, [currentPage, pageSize, selectedRowIndex, open]);

  const handleDelete = async (index: number) => {
    try {
      const memberIdToDelete = members[index].id;
      await DeleteMemberById(memberIdToDelete);
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

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const getGenderNameById = (genderId: number): string => {
    const selectedGender = genderOptions.find(
      (gender) => gender.id === genderId
    );
    return selectedGender ? selectedGender.genderName : "";
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
    setErrors({
      firstName: "",
      lastName: "",
      emailAddress: "",
      mobileNumber: undefined,
    });
  };

  const handleFormChange = async (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >,
    checked?: boolean
  ) => {
    const { name, value } = event.target;
    if (name === "isActive") {
      const newIsActive = !!checked;
      setIsActive(newIsActive);
      setMemberUtility((prev) => ({ ...prev, isActive: newIsActive }));
    } else {
      setMemberUtility((prevData) => ({
        ...prevData,
        [name as string]: value,
      }));
    }
  };

  const handleEdit = (index: number) => {
    if (index !== null) {
      const selectedMember = members[index];
      setOpen(true);
      setDialogTitle("Update Member");
      setMemberUtility({
        id: selectedMember.id,
        firstName: selectedMember.firstName,
        lastName: selectedMember.lastName,
        emailAddress: selectedMember.emailAddress,
        mobileNumber: selectedMember.mobileNumber,
        address: selectedMember.address,
        dob: selectedMember.dob
          ? dayjs(selectedMember.dob).format("YYYY-MM-DD")
          : "",
        genderId: selectedMember.genderId,
        isActive: selectedMember.isActive,
      });
      // console.log(newMemberData.genderId)
      setSelectedRowIndex(index);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setDialogTitle("Add Member");
    setMemberUtility({
      id: "",
      firstName: "",
      lastName: "",
      emailAddress: "",
      mobileNumber: undefined,
      address: "",
      dob: "",
      genderId: 0,
      isActive: true,
    });
    setSelectedRowIndex(null);
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue.length >= 1) {
      try {
        const response = await GetMemberFilter(newValue);
        // console.log(response);
        setFilteredMembers(response);
      } catch (error) {
        console.error("Error fetching filtered members data:", error);
      }
    } else {
      setFilteredMembers([]);
    }
  };

  const handleMemberSelect = (
    event: React.ChangeEvent<{}>,
    selectedOption: string | null | number,
    property: string
  ) => {
    const selectedMember = filteredMembers.find(
      (member) =>
        member.firstName === selectedOption ||
        member.emailAddress === selectedOption ||
        String(member.mobileNumber) === selectedOption
    );
    if (selectedMember) {
      console.log(selectedMember);
      console.log(property);
      console.log(selectedOption);
      setFilterDto((previous: FilterDto) => ({
        ...previous,
        firstName:
          property === "firstName"
            ? String(selectedOption)
            : previous.firstName,
        nameMemberId:
          property === "firstName" ? selectedMember.id : previous.nameMemberId,
        emailAddress:
          property === "email" ? String(selectedOption) : previous.emailAddress,
        emailMemberId:
          property === "email" ? selectedMember.id : previous.emailMemberId,
        mobileNumber:
          property === "mobileNo"
            ? Number(selectedOption)
            : previous.mobileNumber,
        numberMemberId:
          property === "mobileNo" ? selectedMember.id : previous.numberMemberId,
      }));
    } else {
      setFilterDto((previous: FilterDto) => ({ ...previous, memberId: null }));
    }
  };

  const handleSave = async (e: any) => {
    console.log(
      memberUtility.firstName,
      memberUtility.lastName,
      memberUtility.emailAddress,
      memberUtility.mobileNumber,
      memberUtility.address,
      memberUtility.dob,
      memberUtility.genderId
    );
    e.preventDefault();
    let val;
    try {
      if (selectedRowIndex != null) {
        if (!isFormDataValid(memberUtility)) {
          val = true;
          console.log(val);
        } else {
          const updatedMember = await UpdateMembers(
            memberUtility.id,
            memberUtility
          );
          console.log("Updated Member:", updatedMember);
          snack.showSnackbar(
            `${"Member updated successfully"}`,
            "success",
            { vertical: "top", horizontal: "center" },
            5000
          );
          val = false;
          fetchData();
        }
        setOpen(val);
      } else {
        if (!isFormDataValid(memberUtility)) {
          val = true;
        } else {
          console.log("AddMember");
          const addmember = await AddMembers(memberUtility);
          console.log("Added", addmember);
          snack.showSnackbar(
            `${"Member added successfully"}`,
            "success",
            { vertical: "top", horizontal: "center" },
            5000
          );
          val = false;
          fetchData();
        }
        setOpen(val);
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

  const handleFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setMemberUtility((prev) => ({ ...prev, firstName: value }));
    if (value === "") {
        setErrors((prevErrors) => ({ ...prevErrors, firstName: "Please enter a first name." }));
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
    }
  };

  const handleLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setMemberUtility((prev) => ({ ...prev, lastName: value }));
    if (value === "") {
        setErrors((prevErrors) => ({ ...prevErrors, lastName: "Please enter a last name." }));
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
    }
  };
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setMemberUtility((prev) => ({ ...prev, emailAddress: value }));
    if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, emailAddress: "Please enter a valid email address." }));
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, emailAddress: "" }));
    }
  };
  const handleMobileNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    if (/^\d{0,10}$/.test(value)) {
        setMemberUtility((prev) => ({ ...prev, mobileNumber: value === '' ? undefined : parseInt(value, 10) }));
        setErrors((prevErrors) => ({ ...prevErrors, mobileNumber: "" }));
    } 
  };
  const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemberUtility((prev) => ({ ...prev, address: event.target.value }));
  };
  const handleDob = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value; 
    setMemberUtility((prev) => ({ ...prev, dob: value }));
    if (value === "") {
        setErrors((prevErrors) => ({ ...prevErrors, dob: "Please enter DOB." }));
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, dob: "" }));
    }
  };
  const handleGenderId = (event: SelectChangeEvent<number>) => {
    const selectedGenderId = event.target.value as number;
    setMemberUtility((prev) => ({ ...prev, genderId: selectedGenderId }));
    if (selectedGenderId === 0) {
        setErrors((prevErrors) => ({ ...prevErrors, genderId: "Please select Gender" }));
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, genderId: "" }));
    }
  };

  const handleAutocompleteGender = (event: React.ChangeEvent<{}>, newValue: Gender | null) => {
    setFilterDto((previous) => ({ ...previous, genderId: newValue ? newValue.id : 0 }));
  }

  const handleAutocompleteFirstName = (event: React.ChangeEvent<{}>, value: string | number | null, reason: AutocompleteChangeReason ) => {
    const inputEvent = event as React.ChangeEvent<HTMLInputElement>;
    handleMemberSelect(inputEvent, value, 'firstName');
    if (!value) {
      setFilterDto((previous) => ({ ...previous, firstName: null }));
    }
  }

  const handleAutocompleteEmail = (event: React.ChangeEvent<{}>, value: string | number | null, reason: AutocompleteChangeReason ) => {
    const inputEvent = event as React.ChangeEvent<HTMLInputElement>;
    handleMemberSelect(inputEvent, value, 'email');
    if (!value) {
      setFilterDto((previous) => ({ ...previous, emailAddress: null }));
    }
  }

  const handleAutocompleteMobile = (event: React.ChangeEvent<{}>, value: string | number | null, reason: AutocompleteChangeReason ) => {
    const inputEvent = event as React.ChangeEvent<HTMLInputElement>;
    handleMemberSelect(inputEvent, value, 'mobileNo');
    if (!value) {
      setFilterDto((previous) => ({ ...previous, mobileNumber: undefined }));
    }
  }

  return {
    memberUtility,
    setMemberUtility,
    handleFirstName,
    handleLastName,
    handleEmail,
    handleMobileNumber,
    handleAddress,
    handleDob,
    handleGenderId,
    genderOptions,
    dialogTitle,
    currentPage,
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
    handleMemberSelect,
    handleSave,
    handleAutocompleteGender,
    handleAutocompleteFirstName,
    handleAutocompleteEmail,
    handleAutocompleteMobile,
    snack,
  };
};

export default MemberUtility;
