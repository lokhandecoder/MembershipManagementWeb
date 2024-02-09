import { useState } from "react";
import { UserSignIn } from "../Models/UserModel";
import useCustomSnackbar from "../Components/useCustomSnackbar";
import { UserLogin } from "../Services/UserServices";
import { useNavigate } from "react-router-dom";

const SignInUtility = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserSignIn>({
    emailAddress: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserSignIn, string | null>>>({});
  const snack = useCustomSnackbar();

  const isFormDataValid = (formData: UserSignIn) => {
    const newErrors: Partial<Record<keyof UserSignIn, string>> = {};
    if (!formData.password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}$/.test(formData.password)) {
      newErrors.password = "Password must be between 8 and 20 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    }
    
    if (!formData.emailAddress || !/^\S+@\S+\.\S+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address.";
    }
    const isValid = Object.keys(newErrors).length === 0;
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!isFormDataValid(formData)) {
        console.log(errors)
      } else {
        console.log("LoggedIn User");
        const adduser = await UserLogin(formData);

        // localStorage.setItem("Token", JSON.stringify(adduser.accessToken))
        sessionStorage.setItem("userId", adduser.user.id)
        sessionStorage.setItem('Token', JSON.stringify(adduser.accessToken))

        snack.showSnackbar(
          `User ${formData.emailAddress} logged in successfully`,
          "success",
          { vertical: "top", horizontal: "center" },
          5000
        );
        navigate('/');
        window.location.reload()

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
    handleEmail,
    handlePassword,
    handleSubmit,
    errors
  }
};

export default SignInUtility;