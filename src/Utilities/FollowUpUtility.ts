import React, { ChangeEvent, useEffect, useState } from "react";
import { FilterDto, FollowUpAction, FollowUpModel } from "../Models/FollowUpModel";
import dayjs from "dayjs";
import { SelectChangeEvent } from "@mui/material/Select";
import useCustomSnackbar from "../Components/useCustomSnackbar";
import { GetFollowUpAction, GetFollowUpBasedOnFilter, GetFollowUpById, GetFollowUps } from "../Services/FollowUpService";
import { Member } from "../Models/MemberModel";
import { Note } from "@mui/icons-material";
const FollowUpUtility = ()=>{

const initialFollowUp :  FollowUpModel = {
    id: "",
    memberId: "",
    note: "",
    followUpDate: '',
    nextFollowUpDate: "" ,
    followUpActionId: 0
}

const [errorMessage, setErrorMessage] = useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<string>("");
  const [editMode, setEditMode] = React.useState(false);
  const [followUp, setFollowUp] = useState<FollowUpModel>();
  const [optiondata, setoptionData] = useState<FollowUpModel[]>([]);
  const [alldata, setAllData] = useState<FollowUpModel[]>([]);
  const [MemberOptions, setMemberOptions] = useState<Member[]>([]);
  const [selectedMemebrId, setSelectedMemeberId] = useState<null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [followUpAction, setFollowUpAction] = useState<FollowUpAction[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FollowUpModel, string>>
  >({});
  const [pageCount, setPageCount] = useState<number>(0);

  const [filterDto, setFilterDto] = useState<FilterDto>({
    memberId: null,
    followUpDate: null,
    nextFollowUpDate: null,
  });

  
  useEffect(() => {
    fetchData();
  }, [selectedMemebrId, page, limit,open,errors]);

  const snack = useCustomSnackbar();

  const isFormDataValid = (followUpUtility: FollowUpModel) => {
   
    const newErrors: Partial<Record<keyof FollowUpModel, string>> = {};
    if (followUpUtility.memberId === "") {
      newErrors.memberId = "Please select the Member.";
      snack.showSnackbar(
        `${"Please select the Member."}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
    if (followUpUtility.followUpDate === "") {
      newErrors.followUpDate = "Please enter a followUp date.";
    }
    if (followUpUtility.nextFollowUpDate === "") {
      newErrors.nextFollowUpDate = "Please select nextFollowUpDate";
      snack.showSnackbar(
        `${"Please select nextFollowUpDate."}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
    if (followUpUtility.note === "") {
      newErrors.note = "Please enter note";
      snack.showSnackbar(
        `${"Please enter note"}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
    if (followUpUtility.followUpActionId === 0) {
        newErrors.followUpActionId = "Please select ActionId";
        snack.showSnackbar(
          `${"Please select ActionId"}`,
          "warning",
          { vertical: "top", horizontal: "center" },
          5000
        );
      }

    const isValid = Object.keys(newErrors).length === 0;

    setErrors(newErrors);
    return isValid;
  };

  const fetchData = async () => {
    // Fetch gender data

    const MemberOptions = await fetch("http://localhost:8083/api/members").then(
      (response) => response.json()
    );
    setMemberOptions(MemberOptions);
    console.log(MemberOptions);
    const searchoption = await GetFollowUps();
    setoptionData(searchoption[0]);

    const actionOption = await GetFollowUpAction();
    setFollowUpAction(actionOption);
    console.log("actionOption", followUpAction);

    const followUpData = await GetFollowUpBasedOnFilter(filterDto, page, limit);
    setAllData(followUpData.followUps);
    setPageCount(followUpData.totalCount);
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleAutocompleteChange = (
    event: React.ChangeEvent<{}>,
    newValue: string | null
  ) => {
    setSearchTerm(newValue || "");
  };
  console.log("optdata", optiondata[0]);
  console.log("alldata", alldata);

  const handleClickOpen = async () => {
    setOpen(true);
    console.log("id",selectedFollowUp);
    
    setFollowUpUtility({
      id: "",
      memberId: "",
      note: "",
      followUpDate: '',
      nextFollowUpDate: "",
      followUpActionId: 0,
      // statusId: 0,
    });

    const actionOption = await GetFollowUpAction();
    setFollowUpAction(actionOption);
    console.log("actionOption", followUpAction);
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({      
          note : "",
          followUpActionId:'',
          followUpDate:'',
          nextFollowUpDate:'',
          memberId:'',
  })
  };

  const handleSave = async (e: any) => {
    // Assuming you have a backend API endpoint to handle follow-up creation
    e.preventDefault();
    console.log("followUpUtility",followUpUtility);
    let val;
    try {
      if (followUpUtility.id === "") {
        console.log(selectedFollowUp);
        if (!isFormDataValid(followUpUtility)) {
         // console.log("Error", errors);
          val = true;
          console.log(val);
        } else {
          const apiUrl = "http://localhost:5115/api/followup";
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              followUpActionId: followUpUtility.followUpActionId,
              MemberId: followUpUtility.memberId,
              Note: followUpUtility.note,
              FollowUpDate: followUpUtility.followUpDate,
              NextFollowUpDate: followUpUtility.nextFollowUpDate,
              StatusId: "1",
            }),
          });
          console.log("Added", followUpUtility);
          // showSnackbar('Member added successfully');
          snack.showSnackbar(
            `${"Member added successfully"}`,
            "success",
            { vertical: "top", horizontal: "center" },
            5000
          );
          val = false;
          setErrorMessage("");
        }
        setOpen(val);
        fetchData();
      } else {
        console.log("edit", selectedFollowUp);
        if (!isFormDataValid(followUpUtility)) {
          console.log("Error");
          val = true;
        } else {
          const apiUrl = `http://localhost:5115/api/followup/${selectedFollowUp}`;
          const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              MemberId: followUpUtility.memberId,
              Note: followUpUtility.note,
              FollowUpDate: followUpUtility.followUpDate,
              NextFollowUpDate: followUpUtility.nextFollowUpDate,
              followUpActionId: followUpUtility.followUpActionId,
              StatusId: "1",
            }),
          });
          console.log(followUp);
          //console.log('Updated Member:', updatedMember);
          // showSnackbar('Member updated successfully');
          snack.showSnackbar(
            `${"Member updated successfully"}`,
            "success",
            { vertical: "top", horizontal: "center" },
            5000
          );
          val = false;
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
        `Error Occurred: ${error.response?.data || "Unknown error"}`,
        "warning",
        { vertical: "top", horizontal: "center" },
        5000
      );
    }
  };

  // const filteredFollowUps = data.filter(
  //   (data) =>
  //     data.followUpDate.toString().includes(searchTerm) ||
  //     data.nextFollowUpDate.toString().includes(searchTerm.toLowerCase())
  // );

  const getMemberNameById = (memberId: string): string => {
    const selectedMember = MemberOptions.find(
      (member: { id: string; }) => member.id === memberId
    );
    return selectedMember ? selectedMember.firstName : "";
  };

  const transformedData = alldata.map(
    ({ memberId, followUpActionId, ...rest }) => ({
      memberId: getMemberNameById(memberId),
      ...rest,
    })
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    //fetchData();
    setPage(newPage);
  };

  const handleEditClick = async (item: FollowUpModel) => {
    if (item !== null) {
      const selectedFollowUp = await GetFollowUpById(item.id);
      setOpen(true);
      setEditMode(true);
      console.log(selectedFollowUp);
      setFollowUpUtility({
        id: selectedFollowUp.id,
        memberId: selectedFollowUp.memberId,
        note: selectedFollowUp.note,
        followUpDate: selectedFollowUp.followUpDate,
        nextFollowUpDate: (selectedFollowUp.nextFollowUpDate),
        followUpActionId: selectedFollowUp.followUpActionId,
        //statusId: selectedFollowUp.statusId,
      });
      setSelectedFollowUp(item.id);
    }
  };

  const handleSearch = async () => {
    try {
      console.log(filterDto);
      //filterDto.memberId = selectedMemebrId;
      if (
        filterDto.memberId !== null ||
        filterDto.followUpDate !== null ||
        filterDto.nextFollowUpDate !== null
      ) {
        const followUpData = await GetFollowUpBasedOnFilter(
          filterDto,
          page,
          limit
        );
        console.log("filteredData", followUpData.followUps);
        setAllData(followUpData.followUps);
        setPageCount(followUpData.followUps.length);

        //fetchDataByGender(Number(selectedGenderId));
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
  };

  const handleActionClick = async (id: string) => {
    try {
      const apiUrl = `http://localhost:5115/api/followup/${id}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Follow-up deleted successfully!");
        fetchData();
        // Refresh data or update state after deletion
      } else if (response.status === 404) {
        console.error("Follow-up not found.");
      } else {
        console.error("Error deleting follow-up:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting follow-up:", error);
    }
  };
const [followUpUtility, setFollowUpUtility] = useState<FollowUpModel>(initialFollowUp);

const handleFollowUpActionChange = (event: SelectChangeEvent<number>) => {
    const newValue = event.target.value as number;
    setFollowUpUtility((prev) => ({ ...prev, followUpActionId: newValue }));
    if (newValue === 0) {
      setErrors((prevErrors) => ({ ...prevErrors, followUpAction: "Please select a follow-up action." }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, followUpAction: "" }));
    }
  };


// const handleNoteChange = (event:React.ChangeEvent<HTMLInputElement>) => {
//     setFollowUpUtility ((prev)=> ({ ...prev, note:event.target.value}));
// }
const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setFollowUpUtility((prev) => ({ ...prev, note: value }));
    if (value === "") {
      setErrors((prevErrors) => ({ ...prevErrors, note: "Please enter a note." }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, note: "" }));
    }
  }


// const handleFollowUpDate = (date:any) => {
//     setFollowUpUtility((prev)=>({...prev, followUpDate : date ?dayjs(date).format('YYYY-MM-DD') : ''}));
// }
const handleFollowUpDate = (date: any) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setFollowUpUtility((prev) => ({
      ...prev,
      followUpDate: formattedDate
    }));
    if (!formattedDate) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        followUpDate: "Please select a follow-up date."
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        followUpDate: ""
      }));
    }
  };

// const handleNextFollowUpDate = (date:any) => {
//     setFollowUpUtility((prev)=>({...prev, nextFollowUpDate : date ? dayjs(date).format('YYYY-MM-DD') : ''}));
// }

const handleNextFollowUpDate = (date: any) => {
    setFollowUpUtility((prev) => ({
        ...prev,
        nextFollowUpDate: date ? dayjs(date).format('YYYY-MM-DD') : ''
    }));
    if (!date) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            nextFollowUpDate: "Please select a next follow-up date."
        }));
    } else {
        setErrors((prevErrors) => ({
            ...prevErrors,
            nextFollowUpDate: ""
        }));
    }
};
// const handleMemberChange = (event: React.ChangeEvent<{}>, newValue: any | null) => {
//     setFollowUpUtility((prev) => ({
//       ...prev,
//       memberId: newValue ? newValue.id : "",
//     }));
//   };
const handleMemberChange = (event: React.ChangeEvent<{}>, newValue: any | null) => {
    setFollowUpUtility((prev) => ({
        ...prev,
        memberId: newValue ? newValue.id : "",
    }));

    if (!newValue) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            memberId: "Please select a member.",
        }));
    } else {
        setErrors((prevErrors) => ({
            ...prevErrors,
            memberId: "",
        }));
    }
};

 


return {followUpUtility,setFollowUpUtility, handleFollowUpActionChange, handleNoteChange,handleFollowUpDate, handleNextFollowUpDate,handleMemberChange,handleActionClick,handleSave,handleSearch,selectedMemebrId, page, limit,open,handleClickOpen,handleEditClick,handlePageChange,getMemberNameById,transformedData,handleClose,setFilterDto,filterDto,alldata,MemberOptions,optiondata,followUpAction,pageCount,selectedFollowUp,snack,errors,followUp}
}

export default FollowUpUtility;