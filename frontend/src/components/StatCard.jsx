export default function StatCard({
    label,
    value,
    description,
    icon: Icon,
    color = "lime",
}) {
    const colors = {
        lime: "bg-lime-100 text-lime-700",
        pink: "bg-pink-100 text-pink-700",
        orange: "bg-orange-100 text-orange-700",
        blue: "bg-blue-100 text-blue-700",
    };

    return (
        <div className="card soft-shadow p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-zinc-500">{label}</p>

                    <p className="mt-2 text-3xl font-bold tracking-tight">
                        {value}
                    </p>

                    {description && (
                        <p className="mt-1 text-xs text-zinc-400">
                            {description}
                        </p>
                    )}
                </div>

                {Icon && (
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}
                    >
                        <Icon size={19} />
                    </div>
                )}
            </div>
        </div>
    );
}
