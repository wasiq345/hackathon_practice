const statusStyles = {
    Pending: {
        dot: "bg-red-500",
        bg: "bg-red-50",
        text: "text-red-600",
    },

    "In Progress": {
        dot: "bg-yellow-500",
        bg: "bg-yellow-50",
        text: "text-yellow-700",
    },

    Resolved: {
        dot: "bg-lime-500",
        bg: "bg-lime-50",
        text: "text-lime-700",
    },
};

export default function StatusBadge({ status }) {
    const style = statusStyles[status] || statusStyles.Pending;

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {status}
        </span>
    );
}
