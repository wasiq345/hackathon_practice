import { useState } from "react";
import { ArrowRight, Building2, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        await register(name, email, password);

        navigate("/dashboard");
    };

    return (
        <div className="flex min-h-screen bg-[#f7f5ef]">
            <div className="hidden w-1/2 items-center justify-center bg-zinc-900 p-12 lg:flex">
                <div className="max-w-lg">
                    <div className="mb-10 flex items-center gap-3 text-white">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-300">
                            <Building2 size={20} className="text-zinc-900" />
                        </div>

                        <span className="text-xl font-bold">CampusFix</span>
                    </div>

                    <div className="rounded-[30px] bg-lime-200 p-10">
                        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-700">
                            Your voice matters
                        </p>

                        <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight text-zinc-900">
                            See a problem?
                            <br />
                            Make it visible.
                        </h1>

                        <p className="mt-6 text-zinc-600">
                            Report campus problems, follow their progress, and
                            upvote issues that affect you.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <p className="mb-2 text-sm text-zinc-500">
                            Get started
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight">
                            Create your account
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                            Join your campus community.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Full name
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                />

                                <input
                                    className="input pl-10"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ali Khan"
                                />
                            </div>
                        </div>

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
                                    className="input pl-10"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@university.edu"
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
                                    className="input pl-10"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                />
                            </div>
                        </div>

                        <button className="btn-primary w-full">
                            Create account
                            <ArrowRight size={17} />
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-zinc-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-zinc-900 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
