import "./Spine.css";

interface SpineProps {
    opened: boolean;
}

export default function Spine({
    opened,
}: SpineProps) {
    return (
        <div
            className={[
                "book__spine",
                opened
                    ? "book__spine--hidden"
                    : "",
            ].join(" ")}
        />
    );
}