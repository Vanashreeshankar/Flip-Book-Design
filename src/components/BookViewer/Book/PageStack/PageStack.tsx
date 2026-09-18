import "./PageStack.css";

import type {
    CSSProperties,
} from "react";


const MAX_VISUAL_LAYERS = 24;


interface PageStackProps {

    currentSheet: number;

    totalSheets: number;

    opened: boolean;

    /*
     * True when the Back Cover itself has
     * finished opening outward and becomes
     * the single centered closed cover.
     *
     * In this state we must NOT hide the
     * page stack.
     */
    closedBackCover?: boolean;
}


interface StackSideProps {

    side:
        | "left"
        | "right";

    count: number;

    totalSheets: number;
}


function StackSide({
    side,
    count,
    totalSheets,
}: StackSideProps) {

    if (
        count <= 0 ||
        totalSheets <= 0
    ) {
        return null;
    }


    const ratio =
        Math.max(
            0,
            Math.min(
                1,
                count / totalSheets,
            ),
        );


    const layerCount =
        Math.max(
            1,
            Math.round(
                ratio *
                MAX_VISUAL_LAYERS,
            ),
        );


    return (

        <div
            className={[
                "page-stack__side",
                `page-stack__side--${side}`,
            ].join(" ")}
        >

            {
                Array.from({
                    length:
                        layerCount,
                }).map(
                    (
                        _,
                        index,
                    ) => {

                        /*
                         * 0 = inner sheet
                         * 1 = outer sheet
                         */

                        const progress =
                            layerCount <= 1
                                ? 1
                                : index /
                                  (
                                      layerCount - 1
                                  );


                        return (

                            <span
                                key={
                                    index
                                }

                                className="
                                    page-stack__sheet
                                "

                                style={
                                    {
                                        "--stack-index":
                                            index,

                                        "--stack-progress":
                                            progress,

                                        "--stack-count":
                                            layerCount,

                                    } as CSSProperties
                                }
                            />

                        );
                    },
                )
            }

        </div>
    );
}


export default function PageStack({
    currentSheet,
    totalSheets,
    opened,
    closedBackCover = false,
}: PageStackProps) {


    const safeCurrentSheet =
        Math.max(
            0,
            Math.min(
                currentSheet,
                totalSheets,
            ),
        );


    const isFinalState =
        totalSheets > 0 &&
        safeCurrentSheet >=
        totalSheets;


    /*
     * ==========================================
     * CLOSED FRONT COVER
     *
     * All sheets are behind the front cover,
     * therefore the thickness is visible
     * on the RIGHT.
     * ==========================================
     */

    const closedLeftSheets =
        0;


    const closedRightSheets =
        totalSheets;


    /*
     * ==========================================
     * SINGLE CLOSED BACK COVER
     *
     * Do NOT hide the PageStack.
     *
     * Visually this is again a closed book,
     * so the paper thickness is visible
     * on the RIGHT side.
     * ==========================================
     */

    const backClosedLeftSheets =
        0;


    const backClosedRightSheets =
        totalSheets;


    /*
     * ==========================================
     * NORMAL OPEN BOOK
     *
     * The active sheet itself is not included
     * inside either resting stack.
     *
     * Example: 5 sheets
     *
     * On 3rd sheet:
     *
     * left  = 2
     * active = 1
     * right = 2
     * ==========================================
     */

    const openedLeftSheets =
        isFinalState
            ? totalSheets
            : safeCurrentSheet;


    const openedRightSheets =
        isFinalState
            ? 0
            : Math.max(
                0,
                totalSheets -
                safeCurrentSheet -
                1,
            );


    let leftSheets =
        0;


    let rightSheets =
        0;


    if (!opened) {

        leftSheets =
            closedLeftSheets;

        rightSheets =
            closedRightSheets;

    } else if (closedBackCover) {

        leftSheets =
            backClosedLeftSheets;

        rightSheets =
            backClosedRightSheets;

    } else {

        leftSheets =
            openedLeftSheets;

        rightSheets =
            openedRightSheets;
    }


    return (

        <div
            className={[
                "page-stack",

                opened &&
                !closedBackCover
                    ? "page-stack--opened"
                    : "page-stack--closed",

                closedBackCover
                    ? "page-stack--back-closed"
                    : "",

                isFinalState &&
                !closedBackCover
                    ? "page-stack--final"
                    : "",

            ].join(" ")}
        >

            <StackSide

                side="left"

                count={
                    leftSheets
                }

                totalSheets={
                    totalSheets
                }
            />


            <StackSide

                side="right"

                count={
                    rightSheets
                }

                totalSheets={
                    totalSheets
                }
            />

        </div>
    );
}