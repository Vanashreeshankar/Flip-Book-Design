import {
    useEffect,
    useState,
    type KeyboardEvent,
} from "react";

import "./BackCover.css";
import { CoverArtwork } from "../Cover/Cover";


interface BackCoverProps {
    visible: boolean;

    onOpeningChange(
        opening: boolean,
    ): void;

    onTransitionChange?(
        transitioning: boolean,
    ): void;
}


export default function BackCover({
    visible,
    onOpeningChange,
    onTransitionChange,
}: BackCoverProps) {

    /*
     * ==========================================
     * BACK COVER VISUAL STATE
     * ==========================================
     *
     * false:
     *
     *     Last Back | THANK YOU
     *
     *     stable final spread
     *
     *
     * true:
     *
     *     Mirrored outside Back Cover
     *
     *     single centered Back Cover
     *
     *
     * IMPORTANT:
     *
     * The state/transition logic is intentionally
     * unchanged from the original working version.
     */

    const [opening, setOpening] =
        useState(false);


    /*
     * ==========================================
     * INFORM BOOK
     * ==========================================
     */

    useEffect(() => {

        onOpeningChange(
            opening,
        );

    }, [
        opening,
        onOpeningChange,
    ]);


    /*
     * ==========================================
     * RESET WHEN HIDDEN
     * ==========================================
     */

    useEffect(() => {

        if (!visible) {

            setOpening(false);

            onOpeningChange(false);
        }

    }, [
        visible,
        onOpeningChange,
    ]);


    /*
     * ==========================================
     * TOGGLE
     * ==========================================
     *
     * ORIGINAL FUNCTIONALITY — UNCHANGED.
     */

    function handleToggle() {

        if (!visible) {
            return;
        }


        onTransitionChange?.(true);

        setOpening(
            value => !value,
        );
    }


    /*
     * ==========================================
     * KEYBOARD
     * ==========================================
     */

    function handleKeyDown(
        event: KeyboardEvent<HTMLDivElement>,
    ) {

        if (!visible) {
            return;
        }


        if (
            event.key === "Enter"

            ||

            event.key === " "
        ) {

            event.preventDefault();

            handleToggle();
        }
    }


    /*
     * ==========================================
     * COVER TRANSITION COMPLETE
     * ==========================================
     *
     * ORIGINAL TRANSITION CALLBACK — UNCHANGED.
     */

    function handleTransitionEnd(
        event: React.TransitionEvent<HTMLDivElement>,
    ) {
        if (
            event.target !== event.currentTarget
        ) {
            return;
        }

        if (
            event.propertyName !==
            "transform"
        ) {
            return;
        }

        onTransitionChange?.(false);
    }


    /*
     * ==========================================
     * RENDER
     * ==========================================
     */

    return (
        <div
            className={[
                "back-cover",

                visible
                    ? "back-cover--visible"
                    : "",

                opening
                    ? "back-cover--opening"
                    : "back-cover--closed",

            ].join(" ")}


            onClick={
                handleToggle
            }


            onKeyDown={
                handleKeyDown
            }


            role="button"


            tabIndex={
                visible
                    ? 0
                    : -1
            }


            aria-hidden={
                !visible
            }
        >

            <div
                className="
                    back-cover__inner
                "
                onTransitionEnd={
                    handleTransitionEnd
                }
            >

                {/* =================================
                    PAPER / COVER EDGE
                ================================= */}

                <div
                    className="
                        back-cover__edge
                    "
                />


                {/* =================================
                    INSIDE / ATTACHED SIDE
                    Stable final spread = TEAL
                ================================= */}

                <div
                    className="
                        back-cover__front
                    "
                >

                    <div
                        className="
                            back-cover__content
                        "
                    >
                        THANK YOU
                    </div>

                </div>


                {/* =================================
                    OUTSIDE OF BACK COVER
                    Visible after the original
                    outward closing flip.

                    Exact front-cover artwork,
                    mirrored horizontally.

                    The central emblem is hidden
                    only on this back-cover copy.
                ================================= */}

                <div
                    className="
                        back-cover__back
                    "
                >

                    <div
                        className="
                            back-cover__artwork
                        "
                        aria-hidden="true"
                    >
                        <CoverArtwork />
                    </div>

                </div>


                {/* =================================
                    FLIP SHADOW
                ================================= */}

                <div
                    className="
                        back-cover__flip-shadow
                    "
                />

            </div>

        </div>
    );
}
