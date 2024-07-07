import React, { useState, useEffect } from "react";
import axios from "axios";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const location = useLocation();

  const history = useNavigate();

  useEffect(() => {
    const { state } = location;
    if (state) {
      setFirstName(state.first_name || "");
      setLastName(state.last_name || "");
      setEmail(state.email || "");
      setMobileNumber(state.mobile_number || "");
    }
  }, [location]);

  const handlesetFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const handlesetLastName = (e) => {
    setLastName(e.target.value);
  };

  const handlesetMobileNumber = (e) => {
    const inputValue = e.target.value;

    const numericValue = inputValue.replace(/\D/g, "");

    setMobileNumber(numericValue);
  };

  const handlesetEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlesetPassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const handlesetConfirmPassword = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
  };

  const EndAdornmentPassword = ({ visible, setVisible }) => {
    return (
      <InputAdornment position="end">
        <IconButton onClick={() => setVisible(!visible)}>
          {visible ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
        </IconButton>
      </InputAdornment>
    );
  };

  const handleSubmit = async (e, toastId) => {
    e.preventDefault();

    try {
      toastId = toast.loading("Loading...", {
        position: "top-right",
        theme: "dark",
      });

      if (password !== confirmPassword) {
        toast.update(toastId, {
          render:
            "Password and Confirm Password do not match. Please re-enter.",
          position: "top-right",
          type: "error",
          autoClose: 5000,
          theme: "colored",
          isLoading: false,
        });
        return;
      }
      // Function to fetch all pages of users
      const fetchAllUserPages = async (page = 1, allUsers = []) => {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/signup/?page=${page}`
        );
        const users = response.data.results;
        allUsers = allUsers.concat(users);

        if (response.data.next) {
          const nextPage = page + 1;
          return fetchAllUserPages(nextPage, allUsers);
        } else {
          return allUsers;
        }
      };

      const allUsers = await fetchAllUserPages();

      const isEmailUnique = !allUsers.find((user) => user.email === email);

      if (!isEmailUnique) {
        toast.update(toastId, {
          render: "Email is already registered. Please use a different email.",
          position: "top-right",
          type: "error",
          autoClose: 3000,
          theme: "colored",
          isLoading: false,
        });
        return;
      }
    } catch (error) {
      toast.update(toastId, {
        render: error.message,
        position: "top-right",
        type: "error",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });
      return;
    }
    const registrationResponse = { status: 201 };

    if (registrationResponse.status === 201) {
      toast.update(toastId, {
        render: "Proceeding to business registration",
        position: "top-right",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });

      setTimeout(() => {
        history("/business", {
          state: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            mobile_number: mobileNumber,
            password: password,
          },
        });
      }, 1500);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        background: "linear-gradient(180deg, #215273 0%, #24CE7B 100%)",
      }}
    >
      <div className="w-[744px] h-[539px] bg-white rounded-[30px] shadow p-8">
        <div className="text-cyan-800 text-3xl font-bold font-['Golos Text'] tracking-wide mb-4">
          Sign Up
        </div>
        <div className="text-cyan-800 text-[25px] font-normal font-['Golos Text'] tracking-wide mb-4">
          Create account
        </div>

        <form onSubmit={handleSubmit} id="sign-up-form">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                First Name
                <span className="text-red-400 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                  *
                </span>
              </label>
              <TextField
                type="text"
                id="sign-up-first-name-field"
                className="w-full h-[45px] bg-white rounded-[5px] border border-zinc-200 pl-4"
                placeholder="Enter First Name..."
                value={firstName}
                onChange={handlesetFirstName}
                required
              />
            </div>

            <div>
              <label className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                Last Name
                <span className="text-red-400 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                  *
                </span>
              </label>
              <TextField
                type="text"
                id="sign-up-last-name-field"
                className="w-full h-[45px] bg-white rounded-[5px] border border-zinc-200 pl-4"
                placeholder="Enter Last Name..."
                value={lastName}
                onChange={handlesetLastName}
                required
              />
            </div>

            <div>
              <label className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                Mobile Number
                <span className="text-red-400 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                  *
                </span>
              </label>
              <TextField
                type="text"
                id="sign-up-mobile-number-field"
                className="w-full h-[45px] bg-white rounded-[5px] border border-zinc-200 pl-4"
                placeholder="Enter Mobile Number..."
                value={mobileNumber}
                onChange={handlesetMobileNumber}
                required
              />
            </div>

            <div>
              <label className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                Email
                <span className="text-red-400 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                  *
                </span>
              </label>
              <TextField
                type="email"
                id="sign-up-email-field"
                className="w-full h-[45px] bg-white rounded-[5px] border border-zinc-200 pl-4"
                placeholder="Enter Email..."
                value={email}
                onChange={handlesetEmail}
                required
              />
            </div>

            <div>
              <label className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                Password
                <span className="text-red-400 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                  *
                </span>
              </label>
              <TextField
                type={visible ? "text" : "password"}
                id="sign-up-password-field"
                className="w-full h-[45px] bg-white rounded-[5px] border border-zinc-200 pl-4"
                placeholder="Enter Password..."
                value={password}
                onChange={handlesetPassword}
                required
                InputProps={{
                  endAdornment: (
                    <EndAdornmentPassword
                      visible={visible}
                      setVisible={setVisible}
                    />
                  ),
                }}
              />
            </div>

            <div>
              <label className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                Confirm Password
                <span className="text-red-400 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                  *
                </span>
              </label>
              <TextField
                type={visible ? "text" : "password"}
                id="sign-up-confirm-password-field"
                className="w-full h-[45px] bg-white rounded-[5px] border border-zinc-200 pl-4"
                placeholder="Confirm Password..."
                value={confirmPassword}
                onChange={handlesetConfirmPassword}
                required
                InputProps={{
                  endAdornment: (
                    <EndAdornmentPassword
                      visible={visible}
                      setVisible={setVisible}
                    />
                  ),
                }}
              />
            </div>

            <div className="col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                id="sign-up-continue-button"
                className="w-[150px] h-[45px] greenButton"
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
