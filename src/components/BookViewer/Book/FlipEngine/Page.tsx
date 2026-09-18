import "./Page.css";
import type { ReactNode } from "react";

export interface PageProps {
    side: "front" | "back";
    index: number;
    active: boolean;
    children: ReactNode;
}

export default function Page({
    side,
    index,
    active,
    children,
}: PageProps) {
    return (
        <section
            className={[
                "page",
                `page--${side}`,
                active ? "page--active" : "",
            ].join(" ")}
            data-page={index}
        >
            <div className="page__surface">

                {/* Page Content */}
                <div className="page__content">
                    {children}
                </div>

                {/* Gradient for paper lighting */}
                <div className="page__light" />

                {/* Future shadow layer */}
                <div className="page__shadow" />

            </div>
        </section>
    );
}