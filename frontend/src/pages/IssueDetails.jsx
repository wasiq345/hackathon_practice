import { useState } from "react";
import {
    ArrowLeft,
    ArrowUp,
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    Send,
    UserRound,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { useIssues } from "../context/IssueContext";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

export default function IssueDetails() {
    const { id } = useParams();

    const { issues, upvoteIssue, addComment } = useIssues();
    const { user } = useAuth();

    const [comment, setComment] = useState("");

    const issue = issues.find((item) => item.id === Number(id));

    if (!issue) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-2xl font-bold">Issue not found</h1>

                <Link
                    to="/dashboard"
                    className="mt-4 inline-block text-sm font-semibold underline"
                >
                    Back to dashboard
                </Link>
            </div>
        );
    }

    const handleComment = (event) => {
        event.preventDefault();

        if (!comment.trim()) return;

        addComment(issue.id, {
            id: Date.now(),
            user: user.name,
            text: comment,
            date: new Date().toISOString().split("T")[0],
        });

        setComment("");
    };

    return (
        <div className="mx-auto max-w-5xl">
            <Link
                to="/issues"
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900"
            >
                <ArrowLeft size={16} />
                Back to issues
            </Link>

            <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
                {/* Main */}

                <div className="space-y-6">
                    <section className="card p-6 lg:p-8">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={issue.status} />

                            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500">
                                {issue.category}
                            </span>
                        </div>

                        <h1 className="mt-5 text-3xl font-bold tracking-tight">
                            {issue.title}
                        </h1>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
                            <span className="flex items-center gap-2">
                                <MapPin size={16} />
                                {issue.location}
                            </span>

                            <span className="flex items-center gap-2">
                                <CalendarDays size={16} />
                                {issue.createdAt}
                            </span>
                        </div>

                        <div className="my-7 h-px bg-zinc-100" />

                        <p className="whitespace-pre-line text-sm leading-7 text-zinc-600">
                            {issue.description}
                        </p>

                        {issue.image && (
                            <img
                                src={issue.image}
                                alt={issue.title}
                                className="mt-6 max-h-[500px] w-full rounded-2xl object-cover"
                            />
                        )}
                    </section>

                    {/* Comments */}

                    <section className="card p-6 lg:p-8">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold">
                                Updates & comments
                            </h2>

                            <p className="mt-1 text-xs text-zinc-500">
                                Discuss this issue with other students and staff.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {issue.comments.length === 0 ? (
                                <p className="rounded-xl bg-zinc-50 p-5 text-sm text-zinc-500">
                                    No comments yet. Be the first to add an update.
                                </p>
                            ) : (
                                issue.comments.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                                            {item.user.charAt(0)}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold">
                                                    {item.user}
                                                </p>

                                                <span className="text-xs text-zinc-400">
                                                    {item.date}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm leading-6 text-zinc-600">
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <form
                            onSubmit={handleComment}
                            className="mt-7 flex gap-3"
                        >
                            <input
                                className="input"
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />

                            <button className="btn-primary shrink-0 px-4">
                                <Send size={17} />
                            </button>
                        </form>
                    </section>
                </div>

                {/* Sidebar */}

                <div className="space-y-5">
                    <section className="rounded-[20px] bg-zinc-900 p-6 text-white">
                        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                            Community support
                        </p>

                        <div className="mt-5 flex items-center gap-4">
                            <button
                                onClick={() => upvoteIssue(issue.id)}
                                className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-lime-300 text-zinc-900 transition hover:bg-lime-200"
                            >
                                <ArrowUp size={20} />

                                <span className="text-lg font-bold">
                                    {issue.upvotes}
                                </span>
                            </button>

                            <div>
                                <p className="font-bold">Students affected</p>

                                <p className="mt-1 text-sm text-zinc-400">
                                    Upvote if you're experiencing this too.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="card p-6">
                        <h3 className="font-bold">Issue information</h3>

                        <div className="mt-5 space-y-5">
                            <InfoRow
                                icon={UserRound}
                                label="Reported by"
                                value={issue.createdBy}
                            />

                            <InfoRow
                                icon={Clock3}
                                label="Status"
                                value={issue.status}
                            />

                            <InfoRow
                                icon={MapPin}
                                label="Location"
                                value={issue.location}
                            />

                            <InfoRow
                                icon={CheckCircle2}
                                label="Assigned to"
                                value={issue.assignedTo || "Not assigned"}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                <Icon size={16} />
            </div>

            <div>
                <p className="text-xs text-zinc-400">{label}</p>

                <p className="mt-0.5 text-sm font-semibold">
                    {value}
                </p>
            </div>
        </div>
    );
}
