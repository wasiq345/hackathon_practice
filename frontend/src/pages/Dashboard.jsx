import {
    ArrowUp,
    CheckCircle2,
    Clock3,
    FilePlus2,
    MapPin,
    TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";

import StatCard from "../components/StatCard";
import IssueCard from "../components/IssueCard";
import { useIssues } from "../context/IssueContext";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { issues } = useIssues();
    const { user } = useAuth();

    const myIssues = issues.filter(
        (issue) => issue.createdBy === user?.name,
    );

    const pending = issues.filter(
        (issue) => issue.status === "Pending",
    ).length;

    const inProgress = issues.filter(
        (issue) => issue.status === "In Progress",
    ).length;

    const resolved = issues.filter(
        (issue) => issue.status === "Resolved",
    ).length;

    const popularIssues = [...issues]
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, 3);

    return (
        <div className="space-y-7">
            {/* Welcome banner */}

            <section className="relative overflow-hidden rounded-[24px] border border-zinc-200 bg-lime-200 p-7 lg:p-9">
                <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-orange-300/70 blur-sm" />

                <div className="absolute right-20 top-10 h-20 w-20 rotate-12 rounded-[40%] bg-pink-400/80" />

                <div className="absolute bottom-[-40px] right-[-20px] h-36 w-36 rounded-full bg-orange-300" />

                <div className="relative max-w-2xl">
                    <p className="mb-3 text-sm font-semibold text-zinc-600">
                        Today, {new Date().toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                        })}
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 lg:text-4xl">
                        Welcome back, {user?.name?.split(" ")[0]}.
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600">
                        Help make your campus better. Report an issue,
                        support existing reports, and keep track of progress.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link to="/report" className="btn-primary">
                            <FilePlus2 size={17} />
                            Report an issue
                        </Link>

                        <Link
                            to="/issues"
                            className="btn-secondary border-zinc-900/10 bg-white/70"
                        >
                            View my issues
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="My reports"
                    value={myIssues.length}
                    description="Issues you've submitted"
                    icon={FilePlus2}
                    color="blue"
                />

                <StatCard
                    label="Pending"
                    value={pending}
                    description="Waiting for action"
                    icon={Clock3}
                    color="pink"
                />

                <StatCard
                    label="In progress"
                    value={inProgress}
                    description="Currently being handled"
                    icon={TrendingUp}
                    color="orange"
                />

                <StatCard
                    label="Resolved"
                    value={resolved}
                    description="Problems fixed"
                    icon={CheckCircle2}
                    color="lime"
                />
            </section>

            {/* Content */}

            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                {/* Popular issues */}

                <div className="card p-5">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                                Community
                            </p>

                            <h2 className="mt-1 text-xl font-bold">
                                Issues affecting students
                            </h2>
                        </div>

                        <Link
                            to="/issues"
                            className="text-sm font-semibold text-zinc-500 hover:text-zinc-900"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {popularIssues.map((issue) => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))}
                    </div>
                </div>

                {/* Impact card */}

                <div className="space-y-6">
                    <div className="rounded-[20px] bg-zinc-900 p-6 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                    Campus impact
                                </p>

                                <h2 className="mt-2 text-2xl font-bold">
                                    {issues.reduce(
                                        (total, issue) => total + issue.upvotes,
                                        0,
                                    )}
                                </h2>

                                <p className="mt-1 text-sm text-zinc-400">
                                    total student upvotes
                                </p>
                            </div>

                            <div className="rounded-xl bg-lime-300 p-3 text-zinc-900">
                                <ArrowUp size={20} />
                            </div>
                        </div>

                        <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">
                            <div className="h-full w-[72%] rounded-full bg-lime-300" />
                        </div>

                        <p className="mt-3 text-xs text-zinc-500">
                            Student reports help staff prioritize the issues
                            affecting the most people.
                        </p>
                    </div>

                    {/* Location card */}

                    <div className="card p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                <MapPin size={19} />
                            </div>

                            <div>
                                <h3 className="font-bold">Campus hotspots</h3>
                                <p className="text-xs text-zinc-500">
                                    Most reported areas
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">
                            {[
                                ["CS Block", 68],
                                ["Engineering Block", 47],
                                ["Central Library", 36],
                            ].map(([name, count]) => (
                                <div key={name}>
                                    <div className="mb-1.5 flex justify-between text-xs">
                                        <span className="font-medium">{name}</span>
                                        <span className="text-zinc-400">{count}</span>
                                    </div>

                                    <div className="h-2 rounded-full bg-zinc-100">
                                        <div
                                            className="h-full rounded-full bg-zinc-900"
                                            style={{ width: `${Math.min(count, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
