import { useMemo, useState } from "react";
import {
    CheckCircle2,
    ChevronDown,
    Clock3,
    Filter,
    Search,
    Users,
} from "lucide-react";

import { categories, locations, staffMembers } from "../data/mockData";

import { useIssues } from "../context/IssueContext";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

export default function StaffDashboard() {
    const { issues, updateIssue } = useIssues();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [location, setLocation] = useState("All");
    const [status, setStatus] = useState("All");

    const filteredIssues = useMemo(() => {
        return issues.filter((issue) => {
            const searchMatch =
                !search ||
                issue.title.toLowerCase().includes(search.toLowerCase()) ||
                issue.description
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const categoryMatch =
                category === "All" || issue.category === category;

            const locationMatch =
                location === "All" ||
                issue.location.includes(location);

            const statusMatch =
                status === "All" || issue.status === status;

            return (
                searchMatch &&
                categoryMatch &&
                locationMatch &&
                statusMatch
            );
        });
    }, [issues, search, category, location, status]);

    const pending = issues.filter(
        (item) => item.status === "Pending",
    ).length;

    const progress = issues.filter(
        (item) => item.status === "In Progress",
    ).length;

    const resolved = issues.filter(
        (item) => item.status === "Resolved",
    ).length;

    const totalUpvotes = issues.reduce(
        (sum, issue) => sum + issue.upvotes,
        0,
    );

    return (
        <div className="space-y-7">
            {/* Header */}

            <section className="relative overflow-hidden rounded-[24px] bg-zinc-900 p-7 text-white lg:p-9">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime-300/20 blur-2xl" />

                <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
                        Staff workspace
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight lg:text-4xl">
                        Campus issue management
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                        Monitor reported problems, prioritize high-impact
                        issues, and keep students updated.
                    </p>
                </div>
            </section>

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total reports"
                    value={issues.length}
                    description="All campus issues"
                    icon={Users}
                    color="blue"
                />

                <StatCard
                    label="Pending"
                    value={pending}
                    description="Need attention"
                    icon={Clock3}
                    color="pink"
                />

                <StatCard
                    label="In progress"
                    value={progress}
                    description="Being handled"
                    icon={Filter}
                    color="orange"
                />

                <StatCard
                    label="Total upvotes"
                    value={totalUpvotes}
                    description={`${resolved} issues resolved`}
                    icon={CheckCircle2}
                    color="lime"
                />
            </section>

            {/* Issue management */}

            <section className="card overflow-hidden">
                <div className="border-b border-zinc-200 p-5 lg:p-6">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold">Reported issues</h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Filter and manage all student reports.
                        </p>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px]">
                        <div className="relative">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                            />

                            <input
                                className="input pl-10"
                                placeholder="Search issues..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <FilterSelect
                            value={category}
                            onChange={setCategory}
                            options={["All", ...categories]}
                        />

                        <FilterSelect
                            value={location}
                            onChange={setLocation}
                            options={["All", ...locations]}
                        />

                        <FilterSelect
                            value={status}
                            onChange={setStatus}
                            options={[
                                "All",
                                "Pending",
                                "In Progress",
                                "Resolved",
                            ]}
                        />
                    </div>
                </div>

                {/* Table */}

                <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full">
                        <thead className="bg-zinc-50 text-left">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Issue
                                </th>

                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Category
                                </th>

                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Upvotes
                                </th>

                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Status
                                </th>

                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Assigned
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100">
                            {filteredIssues.map((issue) => (
                                <tr
                                    key={issue.id}
                                    className="transition hover:bg-zinc-50"
                                >
                                    <td className="max-w-md px-6 py-4">
                                        <p className="font-semibold">{issue.title}</p>

                                        <p className="mt-1 text-xs text-zinc-400">
                                            {issue.location}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                                            {issue.category}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="font-bold">
                                            {issue.upvotes}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <select
                                            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold outline-none"
                                            value={issue.status}
                                            onChange={(e) =>
                                                updateIssue(issue.id, {
                                                    status: e.target.value,
                                                })
                                            }
                                        >
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>Resolved</option>
                                        </select>
                                    </td>

                                    <td className="px-6 py-4">
                                        <select
                                            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold outline-none"
                                            value={issue.assignedTo || ""}
                                            onChange={(e) =>
                                                updateIssue(issue.id, {
                                                    assignedTo:
                                                        e.target.value || null,
                                                })
                                            }
                                        >
                                            <option value="">Unassigned</option>

                                            {staffMembers.map((staff) => (
                                                <option key={staff} value={staff}>
                                                    {staff}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}

                <div className="space-y-3 p-4 lg:hidden">
                    {filteredIssues.map((issue) => (
                        <div
                            key={issue.id}
                            className="rounded-xl border border-zinc-200 p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-bold">{issue.title}</h3>

                                    <p className="mt-1 text-xs text-zinc-400">
                                        {issue.location}
                                    </p>
                                </div>

                                <StatusBadge status={issue.status} />
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-zinc-400">
                                        Category
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        {issue.category}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-zinc-400">
                                        Upvotes
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        {issue.upvotes}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3">
                                <select
                                    className="input"
                                    value={issue.status}
                                    onChange={(e) =>
                                        updateIssue(issue.id, {
                                            status: e.target.value,
                                        })
                                    }
                                >
                                    <option>Pending</option>
                                    <option>In Progress</option>
                                    <option>Resolved</option>
                                </select>

                                <select
                                    className="input"
                                    value={issue.assignedTo || ""}
                                    onChange={(e) =>
                                        updateIssue(issue.id, {
                                            assignedTo: e.target.value || null,
                                        })
                                    }
                                >
                                    <option value="">Unassigned</option>

                                    {staffMembers.map((staff) => (
                                        <option key={staff} value={staff}>
                                            {staff}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}

                    {filteredIssues.length === 0 && (
                        <p className="py-10 text-center text-sm text-zinc-500">
                            No issues found.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}

function FilterSelect({ value, onChange, options }) {
    return (
        <div className="relative">
            <select
                className="input appearance-none pr-9"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>

            <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
        </div>
    );
}
