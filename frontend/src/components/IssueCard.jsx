import {
    ArrowUp,
    ChevronRight,
    MapPin,
    MessageCircle,
} from "lucide-react";

import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { useIssues } from "../context/IssueContext";

export default function IssueCard({ issue }) {
    const { upvoteIssue } = useIssues();

    return (
        <div className="group rounded-2xl border border-zinc-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5">
            <div className="flex gap-4">
                {/* Upvotes */}

                <button
                    onClick={() => upvoteIssue(issue.id)}
                    className="flex h-14 min-w-[58px] flex-col items-center justify-center rounded-xl bg-zinc-50 text-zinc-500 transition hover:bg-lime-100 hover:text-lime-700"
                >
                    <ArrowUp size={17} />

                    <span className="text-sm font-bold">
                        {issue.upvotes}
                    </span>
                </button>

                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={issue.status} />

                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500">
                            {issue.category}
                        </span>
                    </div>

                    <Link to={`/issues/${issue.id}`}>
                        <h3 className="line-clamp-1 text-base font-bold transition group-hover:text-zinc-600">
                            {issue.title}
                        </h3>
                    </Link>

                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-500">
                        {issue.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {issue.location}
                        </span>

                        <span className="flex items-center gap-1.5">
                            <MessageCircle size={14} />
                            {issue.comments.length}
                        </span>
                    </div>
                </div>

                <Link
                    to={`/issues/${issue.id}`}
                    className="hidden h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 sm:flex"
                >
                    <ChevronRight size={18} />
                </Link>
            </div>
        </div>
    );
}
