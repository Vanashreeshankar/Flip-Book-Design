import {
    useState,
} from "react";

import "./BookView.css";

import Background from "./Background/Background";
import Book from "./Book/Book";

export default function BookViewer() {
    const [
        backgroundPaused,
        setBackgroundPaused,
    ] = useState(false);

    return (
        <main className="viewer">

            <Background
                paused={backgroundPaused}
            />

            <section className="viewer__stage">
                <Book
                    onAnimationPauseChange={
                        setBackgroundPaused
                    }
                />
            </section>

        </main>
    );
}