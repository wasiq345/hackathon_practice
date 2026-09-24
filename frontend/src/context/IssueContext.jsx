import { createContext, useContext, useState } from "react";

import { mockIssues } from "../data/mockData";

const IssueContext = createContext(null);

export function IssueProvider({ children }) {
    const [issues, setIssues] = useState(mockIssues);

    const addIssue = (issue) => {
        const newIssue = {
            ...issue,
            id: Date.now(),
            status: "Pending",
            upvotes: 0,
            createdAt: new Date().toISOString().split("T")[0],
            comments: [],
        };

        setIssues((previous) => [newIssue, ...previous]);

        return newIssue;
    };

    const upvoteIssue = (id) => {
        setIssues((previous) =>
            previous.map((issue) =>
                issue.id === id
                    ? {
                        ...issue,
                        upvotes: issue.upvotes + 1,
                    }
                    : issue,
            ),
        );
    };

    const updateIssue = (id, updates) => {
        setIssues((previous) =>
            previous.map((issue) =>
                issue.id === id
                    ? {
                        ...issue,
                        ...updates,
                    }
                    : issue,
            ),
        );
    };

    const addComment = (id, comment) => {
        setIssues((previous) =>
            previous.map((issue) =>
                issue.id === id
                    ? {
                        ...issue,
                        comments: [...issue.comments, comment],
                    }
                    : issue,
            ),
        );
    };

    return (
        <IssueContext.Provider
            value={{
                issues,
                addIssue,
                upvoteIssue,
                updateIssue,
                addComment,
            }}
        >
            {children}
        </IssueContext.Provider>
    );
}

export function useIssues() {
    return useContext(IssueContext);
}
