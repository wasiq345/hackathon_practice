import { Menu, Search, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onMenuClick }) {
    const { user } = useAuth();

    return (
        <header className="flex h-[82px] items-center justify-between border-b border-zinc-200 bg-[#f7f5ef]/90 px-5 backdrop-blur lg:px-8">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="rounded-xl border border-zinc-200 bg-white p-2.5 lg:hidden"
                >
                    <Menu size={19} />
                </button>

                <div className="hidden items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 md:flex md:w-72">
                    <Search size={17} className="text-zinc-400" />

                    <span className="text-sm text-zinc-400">
                        Search issues...
                    </span>

                    <span className="ml-auto rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-400">
                        /
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-zinc-500 hover:bg-white">
                    <Bell size={19} />

                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-pink-400" />
                </button>

                <div className="hidden h-7 w-px bg-zinc-200 sm:block" />

                <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-semibold">{user?.name}</p>
                        <p className="text-[11px] capitalize text-zinc-500">
                            {user?.role}
                        </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-200 text-sm font-bold text-orange-900">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
}
