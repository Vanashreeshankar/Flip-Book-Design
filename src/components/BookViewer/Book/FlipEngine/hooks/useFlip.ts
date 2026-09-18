import { useCallback, useMemo, useState } from "react";

interface UseFlipProps {
    totalSheets: number;
}

export default function useFlip({
    totalSheets,
}: UseFlipProps) {
    /*
     * currentSheet meaning:
     *
     * 0 -> first sheet is on the right
     * 1 -> first sheet flipped, second sheet on right
     * 2 -> first two sheets flipped, third on right
     * ...
     * totalSheets -> all sheets flipped, Back Cover visible
     */

    const [currentSheet, setCurrentSheet] = useState(0);

    /*
     * We intentionally allow currentSheet === totalSheets.
     * That state represents the Back Cover.
     */

    const canNext = currentSheet < totalSheets;

    const canPrevious = currentSheet > 0;

    const next = useCallback(() => {
        setCurrentSheet((value) => {
            if (value >= totalSheets) {
                return value;
            }

            return value + 1;
        });
    }, [totalSheets]);

    const previous = useCallback(() => {
        setCurrentSheet((value) => {
            if (value <= 0) {
                return value;
            }

            return value - 1;
        });
    }, []);

    const reset = useCallback(() => {
        setCurrentSheet(0);
    }, []);

    return useMemo(
        () => ({
            currentSheet,
            canNext,
            canPrevious,
            next,
            previous,
            reset,
        }),
        [
            currentSheet,
            canNext,
            canPrevious,
            next,
            previous,
            reset,
        ],
    );
}