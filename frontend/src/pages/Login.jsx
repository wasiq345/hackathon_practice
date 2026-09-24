import { useState } from "react";
import { ArrowRight, Building2, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loggedInUser = await login(email, password);

        if (loggedInUser.role === "staff") {
            navigate("/staff");
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f7f5ef]">
            {/* Left visual panel */}

            <div className="relative hidden overflow-hidden bg-zinc-900 lg:flex lg:w-1/2">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(190,242,100,0.25),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(251,146,60,0.2),transparent_35%)]" />

                <div className="relative flex w-full flex-col justify-between p-12">
                    <div className="flex items-center gap-3 text-white">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-300">
                            <Building2 size={20} className="text-zinc-900" />
                        </div>

                        <span className="text-xl font-bold">CampusFix</span>
                    </div>

                    <div>
                        <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-lime-300">
                            Better campus. Together.
                        </p>

                        <h1 className="max-w-xl text-5xl font-bold leading-[1.05] tracking-tight text-white">
                            Report it.
                            <br />
                            Track it.
                            <br />
                            Fix it.
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-7 text-zinc-400">
                            A simple way for students and university staff to
                            work together and make campus better.
                        </p>
                    </div>

                    <p className="text-xs text-zinc-500">
                        © 2026 CampusFix
                    </p>
                </div>
            </div>

            {/* Form */}

            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="mb-8 lg:hidden">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white">
                                <Building2 size={19} />
                            </div>

                            <span className="text-xl font-bold">CampusFix</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="mb-2 text-sm font-medium text-zinc-500">
                            Welcome back
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight">
                            Sign in to your account
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                            Report and track issues around your campus.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                University email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                />

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@university.edu"
                                    className="input pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                />

                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input pl-10"
                                />
                            </div>
                        </div>

                        <button className="btn-primary w-full">
                            Sign in
                            <ArrowRight size={17} />
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-zinc-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-zinc-900 hover:underline"
                        >
                            Create one
                        </Link>
                    </p>

                    <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-4 text-xs text-zinc-500">
                        <strong className="text-zinc-700">Demo:</strong> use any
                        email/password. An email containing{" "}
                        <code className="rounded bg-zinc-100 px-1">staff</code>{" "}
                        opens the staff dashboard.
                    </div>
                </div>
            </div>
        </div>
    );
}
