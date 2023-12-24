import { RxDashboard } from "react-icons/rx";
import { FiUsers, FiSettings } from "react-icons/fi";
import { TiMessages } from "react-icons/ti";
import { RiPingPongLine } from "react-icons/ri";
import { HiOutlineUserGroup } from "react-icons/hi";

export interface DefaultSidebarItemsProps {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const defaultSidebarItems: DefaultSidebarItemsProps[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <RxDashboard className="w-6 h-6" />,
  },
  {
    label: "Rooms",
    href: "/rooms",
    icon: <HiOutlineUserGroup className="w-6 h-6" />,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: <TiMessages className="w-6 h-6" />,
  },
  {
    label: "Play",
    href: "/game",
    icon: <RiPingPongLine className="w-6 h-6" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <FiSettings className="w-6 h-6" />,
  },
];
