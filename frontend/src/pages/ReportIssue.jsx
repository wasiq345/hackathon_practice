import { useRef, useState } from "react";
import {
    ArrowLeft,
    Camera,
    FilePlus2,
    MapPin,
    Upload,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { categories, locations } from "../data/mockData";
import { useIssues } from "../context/IssueContext";
import { useAuth } from "../context/AuthContext";

export default function ReportIssue() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { addIssue } = useIssues();
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        const issue = addIssue({
            title,
            description,
            category,
            location,
            image,
            createdBy: user.name,
            assignedTo: null,
        });

        navigate(`/issues/${issue.id}`);
    };

    const handleImage = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setImage(URL.createObjectURL(file));
    };

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-7">
                <Link
                    to="/dashboard"
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900"
                >
                    <ArrowLeft size={16} />
                    Back to dashboard
                </Link>

                <h1 className="text-3xl font-bold tracking-tight">
                    Report an issue
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                    Tell us what's wrong and where it happened.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Basic info */}

                <section className="card p-6 lg:p-8">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                            <FilePlus2 size={19} />
                        </div>

                        <div>
                            <h2 className="font-bold">Issue details</h2>
                            <p className="text-xs text-zinc-500">
                                Give us enough information to understand the problem.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Title
                            </label>

                            <input
                                className="input"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Wi-Fi not working in CS Lab 3"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Description
                            </label>

                            <textarea
                                className="input min-h-[150px] resize-none"
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what is happening, when it started, and how it affects students..."
                            />

                            <p className="mt-2 text-xs text-zinc-400">
                                Be as specific as possible.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Classification */}

                <section className="card p-6 lg:p-8">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                            <MapPin size={19} />
                        </div>

                        <div>
                            <h2 className="font-bold">Location & category</h2>
                            <p className="text-xs text-zinc-500">
                                Help staff find and classify the issue.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Category
                            </label>

                            <select
                                className="input"
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select category</option>

                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Campus / location
                            </label>

                            <select
                                className="input"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                <option value="">Select location</option>

                                {locations.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Image */}

                <section className="card p-6 lg:p-8">
                    <div className="mb-5">
                        <h2 className="font-bold">Add a photo</h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            Optional. A photo can help staff understand the
                            problem faster.
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImage}
                    />

                    {image ? (
                        <div className="relative overflow-hidden rounded-2xl border border-zinc-200">
                            <img
                                src={image}
                                alt="Issue preview"
                                className="max-h-[350px] w-full object-cover"
                            />

                            <button
                                type="button"
                                onClick={() => setImage(null)}
                                className="absolute right-3 top-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold shadow"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 transition hover:border-zinc-400 hover:bg-zinc-100"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                                <Camera size={22} className="text-zinc-500" />
                            </div>

                            <p className="mt-4 text-sm font-semibold">
                                Upload a photo
                            </p>

                            <p className="mt-1 text-xs text-zinc-400">
                                PNG, JPG up to 10MB
                            </p>
                        </button>
                    )}
                </section>

                {/* Submit */}

                <div className="flex justify-end gap-3 pb-8">
                    <Link to="/dashboard" className="btn-secondary">
                        Cancel
                    </Link>

                    <button type="submit" className="btn-primary">
                        <Upload size={17} />
                        Submit issue
                    </button>
                </div>
            </form>
        </div>
    );
}
