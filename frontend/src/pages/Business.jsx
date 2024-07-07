import React, { useState, useMemo } from "react";
import axios from "axios";
import { TextField, MenuItem } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countryList from "react-select-country-list";
import Select from "react-select";
import { useUserStore } from "../store/useUserStore";

export const Business = () => {
  const [businessName, setBusinessName] = useState("");
  const [country, setCountry] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");

  const countryOptions = useMemo(() => countryList().getData(), []);

  const businessOptions = useMemo(
    () => [
      { label: "Food & Beverage", value: "food_beverage" },
      { label: "Automotive", value: "automotive" },
      { label: "Computer Electronics", value: "computer_electronics" },
      { label: "Healthcare", value: "healthcare" },
      { label: "Fashion & Apparel", value: "fashion_apparel" },
      { label: "Home & Garden", value: "home_garden" },
      { label: "Travel & Tourism", value: "travel_tourism" },
      { label: "Sports & Recreation", value: "sports_recreation" },
    ],
    []
  );

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      width: "100%",
      height: "56px",
      backgroundColor: "white",
      borderRadius: "5px",
      border: "1px solid #zinc-200",
      paddingLeft: "4px",
    }),
  };

  const location = useLocation();

  const history = useNavigate();

  const login = useUserStore((state) => state.setLogin);

  const { first_name, last_name, email, mobile_number, password } =
    location.state || {};

  const handlesetBusinessName = (e) => {
    setBusinessName(e.target.value);
  };

  const handlesetCountry = (country) => {
    setCountry(country);
  };

  const handlesetBusinessCategory = (businessCategory) => {
    setBusinessCategory(businessCategory);
  };

  const handleSubmit = async (e, toastId) => {
    e.preventDefault();

    try {
      toastId = toast.loading("Loading...", {
        position: "top-right",
        theme: "dark",
      });

      const response = await axios.post("http://127.0.0.1:8000/api/signup/", {
        first_name: first_name,
        last_name: last_name,
        email: email,
        mobile_number: mobile_number,
        password: password,
        business: {
          name: businessName,
          category: businessCategory.label,
          country: country.label,
        },
      });

      if (response.status === 201) {
        toast.update(toastId, {
          render: "Registration successful! Moving on to the dashboard.",
          position: "top-right",
          type: "success",
          autoClose: 3000,
          theme: "colored",
          isLoading: false,
        });

        login(response.data);
        setTimeout(() => {
          history("/master");
        }, 1500);

        return;
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data.name)
      ) {
        toast.update(toastId, {
          render: capitalizeFirstLetter(error.response.data.name[0]),
          position: "top-right",
          type: "error",
          autoClose: 3000,
          theme: "colored",
          isLoading: false,
        });
      } else {
        toast.update(toastId, {
          render: error.message,
          position: "top-right",
          type: "error",
          autoClose: 3000,
          theme: "colored",
          isLoading: false,
        });
      }
    }
  };

  const handleBack = async (e) => {
    e.preventDefault();

    toast.loading("Going back to signup", {
      position: "top-right",
      autoClose: 3000,
      type: "info",
      closeOnClick: true,
      theme: "colored",
    });
    setTimeout(() => {
      history("/signup", {
        state: {
          first_name,
          last_name,
          email,
          mobile_number,
          password,
        },
      });
    }, 1500);
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
          Business Information
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                Business Name
                <span className="text-red-400 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                  *
                </span>
              </label>
              <TextField
                type="text"
                id="business-name"
                className="w-full h-[45px] bg-white rounded-[5px] border border-zinc-200 pl-4"
                placeholder="Enter Business Name..."
                value={businessName}
                onChange={handlesetBusinessName}
                required
              />
            </div>

            <div className="col-span-1">
              <label className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                Business Category
                <span className="text-red-400 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                  *
                </span>
              </label>

              <Select
                options={businessOptions}
                id="business-category"
                value={businessCategory}
                onChange={handlesetBusinessCategory}
                styles={customStyles}
                placeholder="Select Business Category..."
                required
              />
              <br />
              <div className="w-[568px] ml-8">
                <input
                  type="checkbox"
                  id="checkbox"
                  className="mr-6 mt-5"
                  required
                />
                <span className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] leading-tight">
                  I have read and agree with {""}
                </span>

                <span className="text-emerald-500 text-[15px] font-normal font-['Golos Text'] underline leading-tight">
                  Terms of Service
                </span>
                <span className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] leading-tight">
                  {" "}
                  ,{" "}
                </span>
                <span className="text-emerald-500 text-[15px] font-normal font-['Golos Text'] underline leading-tight">
                  Privacy Notice
                </span>
                <span className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] leading-tight">
                  , and
                  <br />
                </span>
                <span className="text-emerald-500 text-[15px] font-normal font-['Golos Text'] underline leading-tight ml-9">
                  Personal Data Collection and Disclosure Policy.
                </span>
              </div>
            </div>

            <div className="col-span-1">
              <label className="text-cyan-800 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                Country
                <span className="text-red-400 text-[15px] font-normal font-['Golos Text'] tracking-tight">
                  *
                </span>
              </label>
              <Select
                options={countryOptions}
                id="country"
                value={country}
                onChange={handlesetCountry}
                styles={customStyles}
                placeholder="Select Country..."
                required
              />
            </div>

            <div className="col-span-2 flex justify-between mt-4">
              <button
                onClick={handleBack}
                id="back-button"
                type="button"
                className="w-[150px] h-[45px] rounded-[5px] border border-emerald-500 flex items-center justify-center"
              >
                <div className="text-center text-emerald-500 text-[15px] font-semibold font-['Golos Text'] tracking-tight">
                  Back
                </div>
              </button>
              <button
                type="submit"
                id="signup-button"
                className="w-[150px] h-[45px] bg-emerald-500 rounded-[5px] text-white text-[15px] font-bold font-['Golos Text'] tracking-tight"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
