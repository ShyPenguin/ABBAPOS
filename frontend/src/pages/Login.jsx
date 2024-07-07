import { group504 } from "../assets/icons";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

function Login() {
  return (
    <section className="abbapos-background h-full w-full flex justify-center items-center font-golos">
      <div className="w-[424px] h-[502px] card p-5">
        <div className="flex flex-col pt-[42px] justify-content items-center mb-[30px] mt-0">
          <img src={group504} className="mb-[13px]" />
          <h1 className="text-primary font-bold text-[30px] leading-normal">
            THE ABBA
          </h1>
          <h2 className="text-primary tracking-[3px] text-[15px] text-center leading-normal">
            POINT OF SALE
          </h2>
        </div>

        <LoginForm />

        <p className="text-[11px] mt-[6px] text-primary text-center">
          Don't have an account?{" "}
          <Link className="text-abbaGreen font-semibold" to="/signup">
            {" "}
            Sign Up here{" "}
          </Link>
        </p>
        <p className="text-[11px] mt-[30px] text-primary text-center mb-0 leading-normal">
          TAI Version : 1.0.2
        </p>
        <p className="m-0 text-[11px] text-primary text-center leading-normal underline underline-offset-1 mb-[38px]">
          Privacy Notice
        </p>
      </div>
    </section>
  );
}

export default Login;
