import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f7f5ef] p-6">
            <div className="text-center">
                <p className="text-sm font-semibold text-zinc-400">
                    404
                </p>

                <h1 className="mt-2 text-4xl font-bold">
                    Page not found
                </h1>

                <p className="mt-3 text-zinc-500">
                    The page you're looking for doesn't exist.
                </p>

                <Link to="/dashboard" className="btn-primary mt-6">
                    Back to dashboard
                </Link>
            </div>
        </div>
    );
}
