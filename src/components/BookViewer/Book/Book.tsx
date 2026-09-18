import {
    useCallback,
    useEffect,
    useState,
} from "react";

import "./Book.css";

import Cover from "./Cover/Cover";
import Spine from "./Spine/Spine";
import PageStack from "./PageStack/PageStack";
import FlipEngine from "./FlipEngine/FlipEngine";


interface BookProps {
    onAnimationPauseChange(paused: boolean): void;
}

export default function Book({
    onAnimationPauseChange,
}: BookProps) {


    /*
     * ==========================================
     * BOOK OPEN STATE
     * ==========================================
     */
    const [
        opened,
        setOpened,
    ] = useState(false);


    /*
     * ==========================================
     * FRONT COVER TRANSITION STATE
     * ==========================================
     *
     * This state is TRUE only while the front
     * cover is physically rotating.
     *
     * Why this is needed:
     *
     * During opening, the cover must temporarily
     * stay above the PageFlip engine so the engine
     * cannot flash through during the first frames
     * of the 3D rotation.
     *
     * After the transition finishes, this becomes
     * FALSE and the original z-index layering is
     * restored so pages work exactly as before.
     */
    const [
        coverTransitioning,
        setCoverTransitioning,
    ] = useState(false);


    /*
     * ==========================================
     * CURRENT SHEET
     * ==========================================
     */
    const [
        currentSheet,
        setCurrentSheet,
    ] = useState(0);


    /*
     * ==========================================
     * TOTAL SHEETS
     * ==========================================
     */
    const [
        totalSheets,
        setTotalSheets,
    ] = useState(0);


    /*
     * ==========================================
     * FINAL BACK COVER SPREAD STATE
     * ==========================================
     */
    const [
        backCover,
        setBackCover,
    ] = useState(false);


    /*
     * ==========================================
     * BACK COVER FLIPPED STATE
     * ==========================================
     */
    const [
        backCoverOpen,
        setBackCoverOpen,
    ] = useState(false);
   /*
     * ==========================================
     * BACKGROUND ANIMATION STATE
     * ==========================================
     *
     * Open book              -> FREEZE
     * Final spread            -> FREEZE
     * Back cover moving       -> FREEZE
     * Closed from front       -> ANIMATE
     * Closed from back        -> ANIMATE
     */
    useEffect(() => {
        const shouldPause =
            opened &&
            !(
                backCover &&
                backCoverOpen
            );

        // This is intentionally lifted to BookView so
        // Background does not need to know anything about
        // the book implementation.
        onAnimationPauseChange(shouldPause);
    }, [
        opened,
        backCover,
        backCoverOpen,
        onAnimationPauseChange,
    ]);


    /*
     * ==========================================
     * RECEIVE SHEET POSITION
     * ==========================================
     */
    const handleSheetChange =
        useCallback(
            (
                nextCurrentSheet: number,
                nextTotalSheets: number,
            ) => {

                setCurrentSheet(
                    nextCurrentSheet,
                );

                setTotalSheets(
                    nextTotalSheets,
                );
            },
            [],
        );


    /*
     * ==========================================
     * OPEN FRONT COVER
     * ==========================================
     */
    function openCover() {

        if (opened) {
            return;
        }


        /*
         * Lock the front cover above PageFlip only
         * while its opening transition is running.
         */
        setCoverTransitioning(
            true,
        );


        /*
         * Always start from the first sheet
         * when opening the front cover.
         */
        setCurrentSheet(
            0,
        );


        /*
         * Reset Back Cover states.
         */
        setBackCover(
            false,
        );

        setBackCoverOpen(
            false,
        );


        /*
         * Start the opening animation.
         */
        setOpened(
            true,
        );
    }


    /*
     * ==========================================
     * CLOSE FRONT COVER
     * ==========================================
     */
    function closeCover() {

        if (!opened) {
            return;
        }


        /*
         * Keep transition state active while
         * returning the front cover.
         */
        setCoverTransitioning(
            true,
        );


        setCurrentSheet(
            0,
        );

        setBackCover(
            false,
        );

        setBackCoverOpen(
            false,
        );


        setOpened(
            false,
        );
    }


    /*
     * ==========================================
     * FRONT COVER TRANSITION COMPLETE
     * ==========================================
     *
     * Restore the normal stacking order only
     * AFTER the cover rotation has completed.
     *
     * This prevents:
     *
     * - back/page flashing at the beginning
     * - cover/PageFlip z-index fighting
     * - pages remaining behind the cover
     */
    function handleCoverTransitionEnd(
        event: React.TransitionEvent<HTMLDivElement>,
    ) {

        /*
         * Ignore transition events bubbling from
         * children.
         */
        if (
            event.target !==
            event.currentTarget
        ) {
            return;
        }


        /*
         * We only care about the cover transform.
         */
        if (
            event.propertyName !==
            "transform"
        ) {
            return;
        }


        setCoverTransitioning(
            false,
        );
    }


    /*
     * ==========================================
     * RENDER
     * ==========================================
     */
    return (

        <article
            className={[
                "book",

                opened
                    ? "book--opened"
                    : "",

                backCover
                    ? "book--back-cover"
                    : "",

                backCoverOpen
                    ? "book--back-cover-open"
                    : "",

                coverTransitioning
                    ? "book--cover-transitioning"
                    : "",

            ].join(" ")}
        >


            {/* =================================
                DYNAMIC PAPER STACK
            ================================= */}

            <PageStack

                currentSheet={
                    currentSheet
                }

                totalSheets={
                    totalSheets
                }

                opened={
                    opened
                }

            />


            {/* =================================
                BOOK SHADOW
            ================================= */}

            <div
                className="
                    book__shadow
                "
            />


            {/* =================================
                BOOK BODY
            ================================= */}

            <div
                className="
                    book__body
                "
            >

                <Spine
                    opened={
                        opened
                    }
                />


                <FlipEngine

                    opened={
                        opened
                    }

                    onCloseCover={
                        closeCover
                    }

                    onSheetChange={
                        handleSheetChange
                    }

                    onBackCoverChange={
                        setBackCover
                    }

                    onBackCoverOpenChange={
                        setBackCoverOpen
                    }


                />

            </div>


            {/* =================================
                FRONT COVER
            ================================= */}

            <div
                className="
                    book__cover
                "

                onClick={
                    openCover
                }

                onTransitionEnd={
                    handleCoverTransitionEnd
                }
            >

                <Cover

                    hover={
                        false
                    }

                    mouse={{
                        x: 0.5,
                        y: 0.5,
                    }}

                />

            </div>

        </article>
    );
}
