import { signOutIcon } from "../assets/icons";
import { useLogout } from "../hooks/useLogout";

function LogoutButton() {
  const logout = useLogout();
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => logout.mutate()}
      id="sign-out-button"
    >
      <img src={signOutIcon} className="w-[16px] h-[17px] mt-[38px]" />
      <h2 className="nav-h3 ">Sign Out</h2>
    </div>
  );
}

export default LogoutButton;
