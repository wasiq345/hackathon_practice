export const mockIssues = [
    {
        id: 1,
        title: "Wi-Fi not working in CS Lab 3",
        description:
            "The Wi-Fi connection keeps disconnecting in CS Lab 3. Multiple students are unable to access online resources during practical sessions.",
        category: "Wi-Fi",
        location: "CS Block — Lab 3",
        status: "Pending",
        upvotes: 47,
        createdAt: "2026-09-22",
        createdBy: "Ali Khan",
        assignedTo: null,
        image: null,
        comments: [
            {
                id: 1,
                user: "Hamza",
                text: "Facing the same problem during every lab session.",
                date: "2026-09-23",
            },
        ],
    },
    {
        id: 2,
        title: "Broken chair in Room 204",
        description:
            "One of the chairs in classroom 204 has a broken backrest and is unsafe to use.",
        category: "Furniture",
        location: "Engineering Block — Room 204",
        status: "In Progress",
        upvotes: 21,
        createdAt: "2026-09-20",
        createdBy: "Sara Ahmed",
        assignedTo: "Usman",
        image: null,
        comments: [
            {
                id: 2,
                user: "Usman",
                text: "Maintenance team has been notified.",
                date: "2026-09-21",
            },
        ],
    },
    {
        id: 3,
        title: "Water cooler not working",
        description:
            "The water cooler near the main library is not dispensing cold water.",
        category: "Facilities",
        location: "Central Library",
        status: "Resolved",
        upvotes: 36,
        createdAt: "2026-09-17",
        createdBy: "Ahmed Raza",
        assignedTo: "Bilal",
        image: null,
        comments: [
            {
                id: 3,
                user: "Bilal",
                text: "The cooling unit has been repaired.",
                date: "2026-09-19",
            },
        ],
    },
    {
        id: 4,
        title: "Projector not displaying",
        description:
            "The projector turns on but does not display anything from the classroom computer.",
        category: "Classroom",
        location: "Business Block — Room 101",
        status: "Pending",
        upvotes: 12,
        createdAt: "2026-09-24",
        createdBy: "Ayesha",
        assignedTo: null,
        image: null,
        comments: [],
    },
    {
        id: 5,
        title: "Washroom lights not working",
        description:
            "Two lights are not working in the second-floor washroom.",
        category: "Maintenance",
        location: "Science Block — 2nd Floor",
        status: "In Progress",
        upvotes: 18,
        createdAt: "2026-09-23",
        createdBy: "Omar",
        assignedTo: "Usman",
        image: null,
        comments: [],
    },
];

export const categories = [
    "Wi-Fi",
    "Furniture",
    "Facilities",
    "Classroom",
    "Maintenance",
    "Cleanliness",
    "Other",
];

export const locations = [
    "CS Block",
    "Engineering Block",
    "Business Block",
    "Science Block",
    "Central Library",
    "Main Campus",
];

export const staffMembers = [
    "Usman",
    "Bilal",
    "Fatima",
    "Hassan",
];
