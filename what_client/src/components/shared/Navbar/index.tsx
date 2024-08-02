import { useAuth } from "@/context/authContext";
import { Dropdown } from "../Dropdown";

import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const items = [
    {
      type: "item" as const,
      label: "Log out",
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 border-b  shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="/"
          className="space-x-3 rtl:space-x-reverse w-14 h-14 bg-black text-white flex items-center justify-center  dark:bg-white dark:text-black"
        >
          <span className="self-center text-lg font-bold whitespace-nowrap dark:text-white">
            What.
          </span>
        </a>

        <div className="flex items-center space-x-4">
          <Dropdown
            triggerLabel={user ? user?.username : ""}
            triggerSubLabel={user ? user?.email : ""}
            triggerIcon={User}
            items={items}
          />
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
