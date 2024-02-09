import { useState } from "react";
import { UserSignup } from "../Models/UserModel";
import useCustomSnackbar from "../Components/useCustomSnackbar";
import { AddUser } from "../Services/UserServices";
import { useNavigate } from "react-router-dom";

const SignUpUtility = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserSignup>({
    id: "",
    firstName: "",
    lastName: "",
    emailAddress: "",
    mobileNumber: 0 || undefined,
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserSignup, string | null>>>({});
  const snack = useCustomSnackbar();


  const isFormDataValid = (formData: UserSignup) => {
    const newErrors: Partial<Record<keyof UserSignup, string>> = {};
    if (formData.firstName.trim() === "") {
      newErrors.firstName = "Please enter a first name.";
    }
    if (formData.lastName.trim() === "") {
      newErrors.lastName = "Please enter a last name.";
    }
    if (!formData.mobileNumber || !/^\d{10}$/.test(String(formData.mobileNumber))) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number.";
    }
    if (!formData.emailAddress || !/^\S+@\S+\.\S+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address.";
    }
    if (!formData.password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}$/.test(formData.password)) {
      newErrors.password = "Password must be between 8 and 20 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    }
    const isValid = Object.keys(newErrors).length === 0;
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("hello")
    try {
      if (!isFormDataValid(formData)) {
        console.log(errors)
      } else {
        console.log("Created User Account");
        const adduser = await AddUser(formData);
        console.log("Added", adduser);
        snack.showSnackbar(
          `${"User Account created successfully"}`,
          "success",
          { vertical: "top", horizontal: "center" },
          5000
        );
        navigate('/thankyou')
      }
    } catch (error: any) {
      console.error("Error saving data:", error.response?.data);
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
    setFormData((prev) => ({ ...prev, firstName: value }));
    if (value === "") {
        setErrors((prevErrors) => ({ ...prevErrors, firstName: "Please enter a first name." }));
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
    }
  };

  const handleLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setFormData((prev) => ({ ...prev, lastName: value }));
    if (value === "") {
        setErrors((prevErrors) => ({ ...prevErrors, lastName: "Please enter a last name." }));
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
    }
  };

  const handleMobileNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    if (/^\d{0,10}$/.test(value)) {
        setFormData((prev) => ({ ...prev, mobileNumber: value === '' ? undefined : parseInt(value, 10) }));
        setErrors((prevErrors) => ({ ...prevErrors, mobileNumber: "" }));
    } 
  };

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setFormData((prev) => ({ ...prev, emailAddress: value }));
    if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
      setErrors((prevErrors) => ({ ...prevErrors, emailAddress: "Please enter a valid email address." }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, emailAddress: "" }));
    }
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setFormData((prev) => ({ ...prev, password: value }));
    if (!value || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}$/.test(value)) {
      setErrors((prevErrors) => ({ ...prevErrors, password: "Password must be between 8 and 20 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character." }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };

  return {
    handleFirstName,
    handleLastName,
    handleMobileNumber,
    handleEmail,
    handlePassword,
    handleSubmit,
    errors,
    snack,
    formData
  }
};

export default SignUpUtility;