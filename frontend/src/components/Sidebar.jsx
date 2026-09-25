import {
    Bell,
    Building2,
    ClipboardList,
    FilePlus2,
    HelpCircle,
    Home,
    LogOut,
    MessageCircle,
    Settings,
    ShieldCheck,
    Users,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ open, onClose }) {
    const { user, logout } = useAuth();

    const studentLinks = [
        {
            name: "Overview",
            path: "/dashboard",
            icon: Home,
        },
        {
            name: "My Issues",
            path: "/issues",
            icon: ClipboardList,
        },
        {
            name: "Report Issue",
            path: "/report",
            icon: FilePlus2,
        },
    ];

    const staffLinks = [
        {
            name: "Overview",
            path: "/staff",
            icon: Home,
        },
        {
            name: "All Issues",
            path: "/staff",
            icon: ClipboardList,
        },
    ];

    const links = user?.role === "staff" ? staffLinks : studentLinks;

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col
          border-r border-zinc-200 bg-[#fbfaf7]
          transition-transform duration-300
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                {/* Logo */}

                <div className="flex h-[82px] items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-black">
                            <div className="absolute h-5 w-8 rounded-full bg-lime-300" />
                            <div className="absolute h-3 w-7 translate-y-2 rounded-full bg-orange-400" />
                        </div>

                        <div>
                            <p className="text-lg font-bold tracking-tight">CampusFix</p>
                            <p className="text-[11px] text-zinc-500">
                                Campus issue portal
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Search */}

                <div className="px-5 pb-6">
                    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
                        <span className="text-zinc-400">
                            <Building2 size={17} />
                        </span>

                        <span className="text-sm text-zinc-400">
                            Search campus...
                        </span>
                    </div>
                </div>

                {/* Navigation */}

                <div className="flex-1 overflow-y-auto px-4">
                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                        Workspace
                    </p>

                    <nav className="space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon;

                            return (
                                <NavLink
                                    key={link.path + link.name}
                                    to={link.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `
                    flex items-center gap-3 rounded-xl px-3 py-2.5
                    text-sm font-medium transition
                    ${isActive
                                            ? "bg-zinc-900 text-white"
                                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                        }
                    `
                                    }
                                >
                                    <Icon size={18} strokeWidth={1.8} />
                                    {link.name}
                                </NavLink>
                            );
                        })}
                    </nav>

                    <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                        Campus
                    </p>

                    <nav className="space-y-1">
                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100">
                            <Bell size={18} />
                            Notifications
                            <span className="ml-auto rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-600">
                                3
                            </span>
                        </button>

                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100">
                            <MessageCircle size={18} />
                            Community
                        </button>

                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100">
                            <Users size={18} />
                            Students
                        </button>

                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100">
                            <Settings size={18} />
                            Settings
                        </button>
                    </nav>
                </div>

                {/* User */}

                <div className="border-t border-zinc-200 p-4">
                    <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-zinc-100">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-200 text-sm font-bold text-orange-900">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{user?.name}</p>
                            <p className="text-xs capitalize text-zinc-500">
                                {user?.role}
                            </p>
                        </div>

                        <button
                            onClick={logout}
                            className="rounded-lg p-2 text-zinc-400 hover:bg-white hover:text-red-500"
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
