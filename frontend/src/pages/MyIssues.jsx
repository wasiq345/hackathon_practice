import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

import IssueCard from "../components/IssueCard";
import EmptyState from "../components/EmptyState";

import { useIssues } from "../context/IssueContext";
import { useAuth } from "../context/AuthContext";

export default function MyIssues() {
    const { issues } = useIssues();
    const { user } = useAuth();

    const [status, setStatus] = useState("All");
    const [search, setSearch] = useState("");

    const myIssues = useMemo(() => {
        return issues
            .filter((issue) => issue.createdBy === user?.name)
            .filter((issue) => {
                if (status === "All") return true;

                return issue.status === status;
            })
            .filter((issue) => {
                if (!search.trim()) return true;

                const value = search.toLowerCase();

                return (
                    issue.title.toLowerCase().includes(value) ||
                    issue.category.toLowerCase().includes(value) ||
                    issue.location.toLowerCase().includes(value)
                );
            });
    }, [issues, user, status, search]);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Personal
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                    My issues
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                    Track the issues you've reported to the university.
                </p>
            </div>

            {/* Filters */}

            <div className="card flex flex-col gap-3 p-4 lg:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    />

                    <input
                        className="input pl-10"
                        placeholder="Search your issues..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <Filter
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    />

                    <select
                        className="input min-w-[180px] pl-9"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option>All</option>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                    </select>
                </div>
            </div>

            {/* Issues */}

            {myIssues.length > 0 ? (
                <div className="space-y-3">
                    {myIssues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No matching issues"
                    description="Try changing your search or status filter."
                />
            )}
        </div>
    );
}
