import { ClipboardList } from "lucide-react";

export default function EmptyState({
    title = "No issues found",
    description = "There are no issues matching your current filters.",
}) {
    return (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
                <ClipboardList size={24} className="text-zinc-400" />
            </div>

            <h3 className="mt-4 text-lg font-bold">{title}</h3>

            <p className="mt-1 max-w-sm text-sm text-zinc-500">
                {description}
            </p>
        </div>
    );
}
