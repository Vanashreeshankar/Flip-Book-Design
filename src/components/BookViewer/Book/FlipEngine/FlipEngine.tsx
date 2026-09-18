import "./FlipEngine.css";

import {
    cloneElement,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import HTMLFlipBook from "react-pageflip";

import BackCover from "../BackCover/BackCover";

import {
    sheets,
} from "../data/sheets";


/*
 * =========================================================
 * REACT-PAGEFLIP
 * =========================================================
 */

const FlipBook =
    HTMLFlipBook as any;


/*
 * =========================================================
 * AUDIO
 * =========================================================
 *
 * Files:
 *
 * public/
 * └── sounds/
 *     ├── page-drag-short.mp3
 *     └── page-turn-short.mp3
 *
 * Because these files are inside /public,
 * they are accessed from the site root.
 */

const PAGE_DRAG_SOUND =
    "/sounds/page-drag-short.mp3";


const PAGE_TURN_SOUND =
    "/sounds/page-turn-short.mp3";


/*
 * =========================================================
 * TYPES
 * =========================================================
 */

interface Props {

    opened: boolean;

    onCloseCover(): void;

    onSheetChange(
        currentSheet: number,
        totalSheets: number,
    ): void;

    onBackCoverChange(
        visible: boolean,
    ): void;

    onBackCoverOpenChange(
        opened: boolean,
    ): void;

}


interface PageSize {

    width: number;

    height: number;
}


/*
 * =========================================================
 * FLIP ENGINE
 * =========================================================
 */

export default function FlipEngine({
    opened,
    onCloseCover,
    onSheetChange,
    onBackCoverChange,
    onBackCoverOpenChange,
}: Props) {


    /*
     * =====================================================
     * ROOT REF
     * =====================================================
     */

    const engineRef =
        useRef<HTMLElement | null>(
            null,
        );


    /*
     * =====================================================
     * PAGEFLIP REF
     * =====================================================
     */

    const flipBookRef =
        useRef<any>(null);


    /*
     * =====================================================
     * AUDIO REFS
     * =====================================================
     *
     * Drag audio:
     *
     * Used while the user physically drags/curls
     * a page.
     *
     * Turn audio:
     *
     * Used once when the page successfully
     * completes its flip.
     */

    const dragAudioRef =
        useRef<HTMLAudioElement | null>(
            null,
        );


    const turnAudioRef =
        useRef<HTMLAudioElement | null>(
            null,
        );


    /*
     * =====================================================
     * AUDIO FADE
     * =====================================================
     */

    const dragFadeFrameRef =
        useRef<number | null>(
            null,
        );


    /*
     * =====================================================
     * DRAG SOUND STATE
     * =====================================================
     *
     * Prevents repeatedly calling play()
     * while PageFlip sends multiple state events.
     */

    const dragSoundPlayingRef =
        useRef(false);


    /*
     * =====================================================
     * PAGE SIZE
     * =====================================================
     */

    const [
        pageSize,
        setPageSize,
    ] = useState<PageSize>({
        width: 340,
        height: 510,
    });


    /*
     * =====================================================
     * CURRENT SHEET
     * =====================================================
     *
     * 0 -> first sheet
     * 1 -> second sheet
     * ...
     * totalSheets -> Last Back | Back Cover
     */

    const [
        currentSheet,
        setCurrentSheet,
    ] = useState(0);


    /*
     * =====================================================
     * 3D SPLINE LIFETIME STATE
     * =====================================================
     *
     * IMPORTANT:
     *
     * This state controls ONLY when the 3D model is
     * allowed to become visible.
     *
     * The Spline viewer itself is mounted independently
     * inside Right.tsx so it can begin loading before
     * the 3D spread is reached.
     *
     * Once this becomes true, it remains true for the
     * entire FlipEngine session.
     *
     * It is reset only when the component is recreated,
     * such as after a page/app reload.
     */

    const [
        splineActivated,
        setSplineActivated,
    ] = useState(false);


    /*
     * =====================================================
     * PAGE FLIPPING STATE
     * =====================================================
     */

    const [
        pageFlipping,
        setPageFlipping,
    ] = useState(false);


    /*
     * =====================================================
     * FIRST SHEET REVERSE FLIP STATE
     * =====================================================
     *
     * The front-cover back face must be visible ONLY while
     * the first sheet is being reverse-flipped.
     */

    const [
        frontCoverReverseFlipping,
        setFrontCoverReverseFlipping,
    ] = useState(false);


    /*
     * =====================================================
     * TOTAL SHEETS
     * =====================================================
     */

    const totalSheets =
        sheets.length;


    /*
     * =====================================================
     * BACK COVER VISIBILITY
     * =====================================================
     *
     * The real overlay BackCover is used only after the
     * final flip has completed.
     *
     * The PageFlip final boundary itself contains a visual
     * BackCover face, so react-pageflip can expose that face
     * naturally during the forward drag.
     */

    const showingBackCover =
        currentSheet >= totalSheets;


    /*
     * =====================================================
     * PRELOAD AUDIO
     * =====================================================
     */

    useEffect(() => {

        const dragAudio =
            new Audio(
                PAGE_DRAG_SOUND,
            );


        /*
         * The drag clip is short.
         *
         * Looping keeps the paper rustle alive
         * if the user holds the page longer.
         */

        dragAudio.loop =
            true;


        dragAudio.preload =
            "auto";


        dragAudio.volume =
            0.16;


        const turnAudio =
            new Audio(
                PAGE_TURN_SOUND,
            );


        turnAudio.preload =
            "auto";


        turnAudio.volume =
            0.5;


        dragAudioRef.current =
            dragAudio;


        turnAudioRef.current =
            turnAudio;


        return () => {

            if (
                dragFadeFrameRef.current !==
                null
            ) {

                cancelAnimationFrame(
                    dragFadeFrameRef.current,
                );


                dragFadeFrameRef.current =
                    null;
            }


            dragAudio.pause();


            dragAudio.currentTime =
                0;


            turnAudio.pause();


            turnAudio.currentTime =
                0;


            dragAudioRef.current =
                null;


            turnAudioRef.current =
                null;


            dragSoundPlayingRef.current =
                false;
        };

    }, []);


    /*
     * =====================================================
     * START DRAG SOUND
     * =====================================================
     */

    const startDragSound =
        useCallback(
            () => {

                const audio =
                    dragAudioRef.current;


                if (!audio) {
                    return;
                }


                if (
                    dragFadeFrameRef.current !==
                    null
                ) {

                    cancelAnimationFrame(
                        dragFadeFrameRef.current,
                    );


                    dragFadeFrameRef.current =
                        null;
                }


                /*
                 * Already playing:
                 *
                 * Just restore its natural
                 * drag volume.
                 */

                if (
                    dragSoundPlayingRef.current
                ) {

                    audio.volume =
                        0.16;

                    return;
                }


                dragSoundPlayingRef.current =
                    true;


                /*
                 * Start quietly.
                 */

                audio.volume =
                    0.02;


                /*
                 * Restart the short rustle
                 * from the beginning.
                 */

                try {

                    audio.currentTime =
                        0;

                } catch {

                    /*
                     * Safe fallback.
                     */

                }


                const playPromise =
                    audio.play();


                if (
                    playPromise &&
                    typeof
                        playPromise.catch ===
                        "function"
                ) {

                    playPromise.catch(
                        () => {

                            /*
                             * Browser may block audio
                             * until a direct user
                             * interaction.
                             *
                             * react-pageflip normally
                             * triggers this from the
                             * user's drag interaction.
                             */

                            dragSoundPlayingRef.current =
                                false;
                        },
                    );
                }


                /*
                 * Small fade-in.
                 */

                const targetVolume =
                    0.16;


                const startTime =
                    performance.now();


                const fadeDuration =
                    90;


                const fadeIn =
                    (
                        now: number,
                    ) => {

                        const progress =
                            Math.min(
                                1,
                                (
                                    now -
                                    startTime
                                ) /
                                fadeDuration,
                            );


                        audio.volume =
                            0.02 +

                            (
                                targetVolume -
                                0.02
                            ) *
                            progress;


                        if (
                            progress <
                            1
                        ) {

                            dragFadeFrameRef.current =
                                requestAnimationFrame(
                                    fadeIn,
                                );

                        } else {

                            dragFadeFrameRef.current =
                                null;
                        }
                    };


                dragFadeFrameRef.current =
                    requestAnimationFrame(
                        fadeIn,
                    );
            },
            [],
        );


    /*
     * =====================================================
     * STOP DRAG SOUND
     * =====================================================
     */

    const stopDragSound =
        useCallback(
            () => {

                const audio =
                    dragAudioRef.current;


                if (!audio) {

                    dragSoundPlayingRef.current =
                        false;

                    return;
                }


                if (
                    dragFadeFrameRef.current !==
                    null
                ) {

                    cancelAnimationFrame(
                        dragFadeFrameRef.current,
                    );


                    dragFadeFrameRef.current =
                        null;
                }


                /*
                 * If nothing is playing,
                 * nothing needs to stop.
                 */

                if (
                    !dragSoundPlayingRef.current
                ) {
                    return;
                }


                const startVolume =
                    audio.volume;


                const startTime =
                    performance.now();


                const fadeDuration =
                    110;


                const fadeOut =
                    (
                        now: number,
                    ) => {

                        const progress =
                            Math.min(
                                1,
                                (
                                    now -
                                    startTime
                                ) /
                                fadeDuration,
                            );


                        audio.volume =
                            Math.max(
                                0,
                                startVolume *
                                (
                                    1 -
                                    progress
                                ),
                            );


                        if (
                            progress <
                            1
                        ) {

                            dragFadeFrameRef.current =
                                requestAnimationFrame(
                                    fadeOut,
                                );

                            return;
                        }


                        audio.pause();


                        try {

                            audio.currentTime =
                                0;

                        } catch {

                            /*
                             * Safe fallback.
                             */

                        }


                        audio.volume =
                            0.16;


                        dragSoundPlayingRef.current =
                            false;


                        dragFadeFrameRef.current =
                            null;
                    };


                dragFadeFrameRef.current =
                    requestAnimationFrame(
                        fadeOut,
                    );
            },
            [],
        );


    /*
     * =====================================================
     * PLAY COMPLETED PAGE TURN SOUND
     * =====================================================
     */

    const playTurnSound =
        useCallback(
            () => {

                const audio =
                    turnAudioRef.current;


                if (!audio) {
                    return;
                }


                /*
                 * Stop any previous instance and
                 * restart immediately.
                 *
                 * This keeps rapid page flipping
                 * responsive.
                 */

                audio.pause();


                try {

                    audio.currentTime =
                        0;

                } catch {

                    /*
                     * Safe fallback.
                     */

                }


                /*
                 * Tiny variation prevents every
                 * page turn from sounding perfectly
                 * identical.
                 */

                audio.playbackRate =
                    0.96 +
                    Math.random() *
                    0.08;


                audio.volume =
                    0.5;


                const playPromise =
                    audio.play();


                if (
                    playPromise &&
                    typeof
                        playPromise.catch ===
                        "function"
                ) {

                    playPromise.catch(
                        () => {},
                    );
                }
            },
            [],
        );


    /*
     * =====================================================
     * REPORT CURRENT SHEET
     *
     * This sends the real flip position to Book.tsx.
     *
     * PageStack then uses:
     *
     * currentSheet
     *
     * and:
     *
     * totalSheets
     *
     * to calculate left/right thickness.
     * =====================================================
     */

    useEffect(() => {

        onSheetChange(
            currentSheet,
            totalSheets,
        );

    }, [
        currentSheet,
        totalSheets,
        onSheetChange,
    ]);


    /*
     * =====================================================
     * MEASURE BOOK
     * =====================================================
     */

    useLayoutEffect(() => {

        if (!opened) {
            return;
        }


        let frameOne = 0;
        let frameTwo = 0;
        let resizeFrame = 0;


        function updateSize() {

            const element =
                engineRef.current;


            if (!element) {
                return;
            }


            const rect =
                element.getBoundingClientRect();


            if (
                rect.width <= 0 ||
                rect.height <= 0
            ) {
                return;
            }


            const width =
                Math.round(
                    rect.width / 2,
                );


            const height =
                Math.round(
                    rect.height,
                );


            if (
                width <= 0 ||
                height <= 0
            ) {
                return;
            }


            setPageSize(
                previous => {

                    if (
                        previous.width ===
                            width &&
                        previous.height ===
                            height
                    ) {
                        return previous;
                    }


                    return {
                        width,
                        height,
                    };
                },
            );
        }


        /*
         * Measure before paint, then once more after
         * the opening layout has settled.
         *
         * This keeps the existing PageFlip instance
         * and all flip behaviour intact.
         */

        updateSize();


        frameOne =
            requestAnimationFrame(
                () => {

                    frameTwo =
                        requestAnimationFrame(
                            updateSize,
                        );
                },
            );


        const observer =
            new ResizeObserver(
                () => {

                    if (resizeFrame) {
                        cancelAnimationFrame(
                            resizeFrame,
                        );
                    }


                    resizeFrame =
                        requestAnimationFrame(
                            updateSize,
                        );
                },
            );


        const element =
            engineRef.current;


        if (element) {

            observer.observe(
                element,
            );
        }


        window.addEventListener(
            "resize",
            updateSize,
        );


        return () => {

            if (frameOne) {
                cancelAnimationFrame(
                    frameOne,
                );
            }


            if (frameTwo) {
                cancelAnimationFrame(
                    frameTwo,
                );
            }


            if (resizeFrame) {
                cancelAnimationFrame(
                    resizeFrame,
                );
            }


            observer.disconnect();


            window.removeEventListener(
                "resize",
                updateSize,
            );
        };

    }, [
        opened,
    ]);


    /*
     * =====================================================
     * BACK COVER STATE
     * =====================================================
     */

    useEffect(() => {

        onBackCoverChange(
            showingBackCover,
        );


        if (!showingBackCover) {

            onBackCoverOpenChange(
                false,
            );
        }


        return () => {

            onBackCoverChange(
                false,
            );

            onBackCoverOpenChange(
                false,
            );
        };

    }, [
        showingBackCover,
        onBackCoverChange,
        onBackCoverOpenChange,
    ]);


    /*
     * =====================================================
     * PAGEFLIP FLIP EVENT
     * =====================================================
     *
     * This fires AFTER a page successfully
     * completes its turn.
     *
     * This is deliberately where the 3D model
     * becomes visible.
     *
     * The 3D spread is:
     *
     *      id 4 BACK | id 5 FRONT
     *
     * Therefore when nextSheet === 4,
     * the UI -> 3D page turn has completely finished
     * and the spread is in its resting position.
     */

    const handleFlip =
        useCallback(
            (
                event: any,
            ) => {

                /*
                 * Stop the dragging rustle first.
                 */

                stopDragSound();


                /*
                 * Play the final paper-turn sound.
                 */

                playTurnSound();


                let spreadIndex =
                    -1;


                try {

                    const pageFlip =
                        event?.object;


                    const collection =
                        pageFlip
                            ?.getPageCollection?.();


                    spreadIndex =
                        Number(
                            collection
                                ?.getCurrentSpreadIndex?.(),
                        );

                } catch {

                    /*
                     * Fallback below.
                     */

                }


                /*
                 * Fallback.
                 */

                if (
                    !Number.isFinite(
                        spreadIndex,
                    ) ||
                    spreadIndex < 0
                ) {

                    const page =
                        Number(
                            event?.data,
                        );


                    if (
                        Number.isFinite(
                            page,
                        )
                    ) {

                        spreadIndex =
                            Math.floor(
                                page / 2,
                            );
                    }
                }


                if (
                    !Number.isFinite(
                        spreadIndex,
                    )
                ) {
                    return;
                }


                const nextSheet =
                    Math.max(
                        0,
                        Math.min(
                            totalSheets,
                            Math.round(
                                spreadIndex,
                            ),
                        ),
                    );


                /*
                 * =================================================
                 * REVEAL 3D MODEL ONLY AFTER REST STATE
                 * =================================================
                 *
                 * Our sheet structure is:
                 *
                 * id 4:
                 *     front = UiRight
                 *     back  = 3D Left
                 *
                 * id 5:
                 *     front = 3D Right
                 *     back  = LastBack
                 *
                 * So:
                 *
                 *     nextSheet === 4
                 *
                 * means the spread is:
                 *
                 *     3D Left | 3D Right
                 *
                 * and the completed flip event has already
                 * happened.
                 *
                 * Spline itself has already been mounted
                 * beforehand by Right.tsx.
                 *
                 * We are only revealing it now.
                 */

                if (
                    nextSheet >= 4 &&
                    !splineActivated
                ) {

                    setSplineActivated(
                        true,
                    );
                }


                setFrontCoverReverseFlipping(
                    false,
                );


                setCurrentSheet(
                    nextSheet,
                );
            },
            [
                totalSheets,
                splineActivated,
                stopDragSound,
                playTurnSound,
            ],
        );


    /*
     * =====================================================
     * PAGEFLIP CHANGE STATE
     * =====================================================
     */

    const handleChangeState =
        useCallback(
            (
                event: any,
            ) => {

                const state =
                    event?.data;


                /*
                 * IMPORTANT
                 *
                 * user_fold means the user is
                 * physically dragging/folding
                 * the page.
                 *
                 * This is where the drag sound
                 * should begin.
                 */

                const isUserDragging =
                    state ===
                    "user_fold";


                /*
                 * flipping is the automatic
                 * completion animation after
                 * the user releases the page.
                 */

                const isFinishingFlip =
                    state ===
                    "flipping";


                /*
                 * Only start the drag sound for
                 * a real user drag.
                 *
                 * fold_corner is intentionally
                 * excluded because hovering over
                 * a corner must not make sound.
                 */

                if (
                    isUserDragging
                ) {

                    startDragSound();

                } else if (
                    state !==
                    "fold_corner"
                ) {

                    /*
                     * Once the user stops dragging,
                     * fade out the rustle.
                     *
                     * The final flip sound will be
                     * played by handleFlip only if
                     * the flip actually completes.
                     */

                    stopDragSound();
                }


                /*
                 * =================================================
                 * FIRST SHEET REVERSE DESTINATION
                 * =================================================
                 *
                 * PageFlip direction:
                 *
                 *     0 = forward
                 *     1 = backward / reverse
                 *
                 * While the first sheet is being reversed,
                 * currentSheet is still 1 until onFlip fires.
                 * We therefore use both currentSheet and direction.
                 *
                 * The front-cover boundary is exposed only for this
                 * interaction. Its transform remains 100% under the
                 * control of react-pageflip, so the cover-back is
                 * revealed progressively with the same curl.
                 */

                let isReverseDirection =
                    false;


                try {

                    isReverseDirection =
                        Number(
                            event?.object
                                ?.getRender?.()
                                ?.getDirection?.(),
                        ) === 1;

                } catch {

                    isReverseDirection =
                        false;
                }


                const isFrontCoverReverse =
                    currentSheet === 1 &&
                    isReverseDirection &&
                    (
                        state ===
                            "user_fold" ||
                        state ===
                            "flipping"
                    );


                setFrontCoverReverseFlipping(
                    isFrontCoverReverse,
                );


                /*
                 * Existing interaction logic.
                 */

                const isRealPageInteraction =
                    isUserDragging ||

                    isFinishingFlip;


                /*
                 * Normal pages:
                 *
                 * Keep the existing hover corner behaviour.
                 *
                 * Final BackCover state:
                 *
                 * Ignore "fold_corner" so hovering cannot expose
                 * the internal pages.
                 */

                const isNormalPageHover =
                    !showingBackCover &&

                    state ===
                    "fold_corner";


                setPageFlipping(
                    isRealPageInteraction ||

                    isNormalPageHover,
                );
            },
            [
                currentSheet,
                showingBackCover,
                startDragSound,
                stopDragSound,
            ],
        );


    /*
     * =====================================================
     * STOP AUDIO WHEN BOOK CLOSES
     * =====================================================
     */

    useEffect(() => {

        if (!opened) {

            setPageFlipping(
                false,
            );

            setFrontCoverReverseFlipping(
                false,
            );

            stopDragSound();
        }

    }, [
        opened,
        stopDragSound,
    ]);


    /*
     * =====================================================
     * CLOSED
     * =====================================================
     */

    if (!opened) {
        return null;
    }


    /*
     * =====================================================
     * PAGE CONTENT
     * =====================================================
     *
     * PAGE ORDER
     *
     * 0  blank
     * 1  Home Front
     * 2  Home Back
     * 3  About Front
     * 4  About Back
     * ...
     * 9  Last Front
     * 10 Last Back
     * 11 blank
     *
     * FINAL SPREAD:
     *
     *      Last Back | blank
     *
     * Back Cover is visually placed underneath
     * the right-side blank area.
     */

    const interiorPages = [

        /*
         * =========================================
         * FRONT BOUNDARY
         * =========================================
         */

        <section
            key="boundary-front"

            className="
                flip-page
                flip-page--front-cover-back
            "

            data-density="soft"
        >

            {/*
             * This is the PageFlip destination for the
             * first-sheet reverse gesture.
             *
             * It remains hidden during normal opening
             * and forward page turns.
             *
             * When the first sheet is dragged backward,
             * react-pageflip reveals this face progressively
             * with the exact same 3D curl as the dragged sheet.
             */}

            <div
                className="flip-cover-back-face"
                aria-hidden="true"
            />

        </section>,


        /*
         * =========================================
         * ALL SHEETS
         * =========================================
         */

        ...sheets.flatMap(
            (
                sheet,
            ) => [

                /*
                 * =========================================
                 * FRONT
                 * =========================================
                 */

                <section
                    key={
                        `${sheet.id}-front`
                    }

                    className="
                        flip-page
                        flip-page--front
                    "

                    data-density="soft"
                >

                    <div
                        className="
                            flip-page__surface
                        "
                    >

                        <div
                            className="
                                flip-page__content
                            "
                        >

                            {
                                sheet.id === 5
                                    ? cloneElement(
                                          sheet.front as any,
                                          {
                                              active:
                                                  splineActivated,
                                          },
                                      )
                                    : sheet.front
                            }

                        </div>


                        <div
                            className="
                                flip-page__light
                            "
                        />

                    </div>

                </section>,


                /*
                 * =========================================
                 * BACK
                 * =========================================
                 */

                <section
                    key={
                        `${sheet.id}-back`
                    }

                    className="
                        flip-page
                        flip-page--back
                    "

                    data-density="soft"
                >

                    <div
                        className="
                            flip-page__surface
                        "
                    >

                        <div
                            className="
                                flip-page__content
                            "
                        >

                            {
                                sheet.back
                            }

                        </div>


                        <div
                            className="
                                flip-page__light
                            "
                        />

                    </div>

                </section>,

            ],
        ),


        /*
         * =========================================
         * FINAL BOUNDARY
         * =========================================
         *
         * IMPORTANT:
         *
         * This remains SOFT.
         *
         * Do NOT make this hard.
         *
         * Last Back must remain soft so that
         * the reverse gesture gets the real curl.
         */

        <section
            key="boundary-back"

            className="
                flip-page
                flip-page--back-cover
            "

            data-density="soft"
        >

            {/*
             * This is the actual PageFlip destination face.
             *
             * Because it lives inside the react-pageflip page
             * sequence, it becomes visible progressively while
             * Last Front is being dragged forward.
             *
             * It is visual-only. The real interactive BackCover
             * overlay still takes over after the flip completes.
             */}

            <BackCover
                visible={true}

                onOpeningChange={
                    () => {}
                }
            />

        </section>,
    ];


    /*
     * =====================================================
     * RENDER
     * =====================================================
     */

    return (

        <section
            ref={
                engineRef
            }

            className={[
                "flip-engine",

                showingBackCover
                    ? "flip-engine--back-cover"
                    : "",

                pageFlipping
                    ? "flip-engine--page-flipping"
                    : "",

                frontCoverReverseFlipping
                    ? "flip-engine--front-cover-reverse"
                    : "",

            ].join(" ")}
        >


            {/* =================================================
                BACK COVER LAYER

                IMPORTANT:

                The Back Cover is rendered BEFORE PageFlip.

                It is the UNDER-LAYER.

                The PageFlip final boundary provides the Back
                Cover visual during the Last Front forward drag.

                After completion, this real overlay BackCover
                handles the stable final state and interaction.
            ================================================= */}

            <div
                className="
                    flip-engine__cover-layer
                "
            >

                <BackCover
                    visible={
                        showingBackCover
                    }

                    onOpeningChange={
                        onBackCoverOpenChange
                    }

                />

            </div>


            {/* =================================================
                PAGEFLIP LAYER
            ================================================= */}

            <div
                className="
                    flip-engine__book
                "
            >

                <FlipBook

                    ref={
                        flipBookRef
                    }

                    width={
                        pageSize.width
                    }

                    height={
                        pageSize.height
                    }

                    size="fixed"

                    autoSize={false}

                    usePortrait={false}

                    showCover={false}

                    startPage={0}

                    useMouseEvents={true}

                    showPageCorners={true}

                    disableFlipByClick={false}

                    swipeDistance={20}

                    flippingTime={850}

                    drawShadow={true}

                    maxShadowOpacity={0.45}

                    startZIndex={1000}

                    mobileScrollSupport={false}

                    clickEventForward={true}

                    renderOnlyPageLengthChange={
                        false
                    }

                    className="
                        flip-page-book
                    "

                    style={{}}

                    onFlip={
                        handleFlip
                    }

                    onChangeState={
                        handleChangeState
                    }

                >

                    {
                        interiorPages
                    }

                </FlipBook>

            </div>


            {/* =================================================
                FRONT COVER CLOSE AREA
            ================================================= */}

            {currentSheet === 0 && (

                <button
                    type="button"

                    className="
                        flip-engine__close-zone
                    "

                    onClick={
                        onCloseCover
                    }

                    aria-label="
                        Close front cover
                    "
                />

            )}

        </section>
    );
}