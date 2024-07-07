import { useState, useRef, useEffect } from "react";
import {
  dashboardIcon,
  dashboardIconBlue,
  group503,
  menuIcon,
  menuIconBlue,
  reportsIcon,
  reportsIconBlue,
  settingsIcon,
  settingsIconBlue,
  userIcon,
  userIconBlue,
} from "../assets/icons";
import { useUserStore } from "../store/useUserStore";
import LogoutButton from "../components/LogoutButton";
import { useLocation, Link } from "react-router-dom";
import Subtract from "../components/Subtract";

function Navbar() {
  const user = useUserStore((state) => state.user);
  const linkRef = useRef(null);

  const location = useLocation();
  const pathname = location.pathname;

  const [starPosition, setStarPosition] = useState();

  const handleLinkClick = (e) => {
    // Get the position of the clicked link
    const linkRect = e.target.getBoundingClientRect();
    const newStarPosition = {
      top: linkRect.top + window.scrollY + linkRect.height / 2,
      left: linkRect.left + window.scrollX + linkRect.width / 2,
    };
    // Set the star's position to the clicked link's center
    setStarPosition(newStarPosition);
  };

  useEffect(() => {
    const masterListDiv = linkRef.current;
    if (masterListDiv) {
      const divRect = masterListDiv.getBoundingClientRect();
      const newStarPosition = {
        top: divRect.top + window.scrollY + divRect.height / 2,
        left: divRect.left + window.scrollX + divRect.width / 2,
      };
      setStarPosition(newStarPosition);
    }
  }, []);

  return (
    <nav className="abbapos-background fixed top-0 bottom-0 left-0 w-[184px] flex flex-col justify-between py-12 font-golos">
      <Link to="/" className="Link pt-0" onClick={(e) => handleLinkClick(e)}>
        <img src={group503} className="w-[69px] h-[69px]" />
        <h1 className="mt-[16px] font-bold text-center w-[133px] leading-normal text-[15px]">
          {user.business.name}
        </h1>
        <p className="w-[130px] h-[22px] text-center text-white text-[11px] font-normal">
          {user.email}
        </p>
      </Link>
      {/* DASHBOARD */}
      <Link
        to="/dashboard"
        className="Link"
        ref={pathname == "/dashboard" ? linkRef : null}
        onClick={(e) => handleLinkClick(e)}
        id="navbar-dashboard"
      >
        <img
          src={pathname !== "/dashboard" ? dashboardIcon : dashboardIconBlue}
          className="w-[20px] h-[20px]"
        />
        <h3 className={`nav-h3 ${pathname == "/dashboard" && "text-primary"}`}>
          Dashboard
        </h3>
      </Link>

      {/* USER */}
      <Link
        to="/user"
        className="Link"
        ref={pathname == "/user" ? linkRef : null}
        onClick={(e) => handleLinkClick(e)}
        id="navbar-user"
      >
        <img
          src={pathname !== "/user" ? userIcon : userIconBlue}
          className="w-[20px] h-[20px]"
        />
        <h3 className={`nav-h3 ${pathname == "/user" && "text-primary"}`}>
          User
        </h3>
      </Link>

      {/* MASTER */}
      <Link
        to="/master"
        className="Link"
        ref={pathname == "/master" ? linkRef : null}
        onClick={(e) => handleLinkClick(e)}
        id="navbar-master"
      >
        <img
          src={
            pathname == "/master" || pathname == "/" ? menuIconBlue : menuIcon
          }
          className="w-[20px] h-[20px] z-10"
          alt="menu-icon"
        />
        <h3
          className={`nav-h3 ${
            (pathname == "/master" || pathname == "/") && "text-primary"
          }`}
        >
          Master List
        </h3>
      </Link>

      {/* REPORTS */}
      <Link
        to="/reports"
        className="Link"
        ref={pathname == "/reports" ? linkRef : null}
        onClick={(e) => handleLinkClick(e)}
        id="navbar-reports"
      >
        <img
          src={pathname !== "/reports" ? reportsIcon : reportsIconBlue}
          className="w-[20px] h-[20px]"
        />
        <h3 className={`nav-h3 ${pathname == "/reports" && "text-primary"}`}>
          Reports
        </h3>
      </Link>

      {/* SETTINGS */}
      <Link
        to="/settings"
        className="Link"
        ref={pathname == "/settings" ? linkRef : null}
        onClick={(e) => handleLinkClick(e)}
        id="navbar-settings"
      >
        <img
          src={pathname !== "/settings" ? settingsIcon : settingsIconBlue}
          className="w-[16px] h-[17px]"
        />
        <h3 className={`nav-h3 ${pathname == "/settings" && "text-primary"}`}>
          Settings
        </h3>
      </Link>

      {/* LOGOUT */}
      <LogoutButton />
      <Subtract style={starPosition} />
    </nav>
  );
}

export default Navbar;
