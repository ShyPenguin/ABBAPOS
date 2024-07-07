import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { crossedEye, email, eye, lock } from "../assets/icons";
import { useLogin } from "../hooks/useLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function LoginForm() {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Not a valid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const login = useLogin();

  const onSubmit = (formData) => {
    login.mutate(formData);
  };

  return (
    <>
      <form className="flex flex-col" id="login-form">
        <div className="mb-[17px]">
          <div className="input-box font-golos">
            <img src={email} className="absolute top-[15px] left-[12px]" />
            <input
              className="input-field"
              placeholder="Email"
              {...register("email")}
              id="login-email-field"
            />
          </div>
          <p className="text-abbaRed font-golos">{errors.email?.message}</p>
        </div>
        <div className="mb-[30px]">
          <div className="input-box font-golos">
            <img src={lock} className="absolute top-[15px] left-[12px]" />
            <input
              className="input-field "
              placeholder="Password"
              type={!passwordVisible ? "password" : undefined}
              {...register("password")}
              id="login-password-field"
            />
            <img
              src={passwordVisible ? crossedEye : eye}
              className="absolute top-[15px] right-[16px]"
              onClick={() => setPasswordVisible(!passwordVisible)}
            />
          </div>
          <p className="text-abbaRed font-golos">{errors.password?.message}</p>
        </div>

        <button
          className="w-[283px] h-[45px] greenButton"
          onClick={handleSubmit(onSubmit)}
          id="login-button"
        >
          Sign In
        </button>
      </form>
      <ToastContainer />
    </>
  );
}

export default LoginForm;
