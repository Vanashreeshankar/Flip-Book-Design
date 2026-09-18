import "./Sheet.css";

import {
    memo,
    type ReactNode,
} from "react";

import Page from "./Page";

export interface SheetProps {
    id: number;

    index: number;

    zIndex: number;

    active: boolean;

    flipped: boolean;

    finalSheet: boolean;

    front: ReactNode;

    back: ReactNode;

    onNext(): void;

    onPrevious(): void;
}


function Sheet({
    id,
    index,
    zIndex,
    active,
    flipped,
    finalSheet,
    front,
    back,
    onNext,
    onPrevious,
}: SheetProps) {

    return (
        <article
            className={[
                "sheet",

                flipped
                    ? "sheet--flipped"
                    : "",

                active
                    ? "sheet--active"
                    : "",

                finalSheet
                    ? "sheet--final"
                    : "",

            ].join(" ")}

            style={{
                zIndex,
            }}

            data-sheet={id}
        >

            {/* =====================================
                FRONT
            ====================================== */}

            <div
                className="
                    sheet__face
                    sheet__face--front
                "

                onClick={
                    active && !flipped
                        ? onNext
                        : undefined
                }
            >

                <Page
                    side="front"

                    index={
                        index * 2
                    }

                    active={active}
                >
                    {front}
                </Page>

            </div>


            {/* =====================================
                BACK
            ====================================== */}

            <div
                className="
                    sheet__face
                    sheet__face--back
                "

                onClick={
                    active && flipped
                        ? onPrevious
                        : undefined
                }
            >

                <Page
                    side="back"

                    index={
                        index * 2 + 1
                    }

                    active={active}
                >
                    {back}
                </Page>

            </div>

        </article>
    );
}


export default memo(Sheet);