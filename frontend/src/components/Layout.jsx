import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f7f5ef]">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:pl-[270px]">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />

                <main className="mx-auto max-w-[1500px] p-5 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
