import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import "./Background.css";

type IconNode = {
    id: string;
    src: string;
    className: string;
    ring?: boolean;
    delay?: string;
};

const iconNodes: IconNode[] = [
    { id: "web", src: "/bg-icons/web.png", className: "node-web", ring: true, delay: "0s" },
    { id: "database", src: "/bg-icons/database.png", className: "node-database", ring: true, delay: "1s" },
    { id: "design", src: "/bg-icons/design.png", className: "node-design", ring: true, delay: "1.6s" },
    { id: "frontend", src: "/bg-icons/frontend.png", className: "node-frontend", ring: true, delay: "0.3s" },
    { id: "phone", src: "/bg-icons/phone.png", className: "node-phone", ring: true, delay: "1.2s" },
    { id: "laptop", src: "/bg-icons/laptop.png", className: "node-laptop", ring: true, delay: "2s" },
    { id: "product", src: "/bg-icons/product.png", className: "node-product", ring: true, delay: "0.8s" },
    { id: "3d", src: "/bg-icons/3d.png", className: "node-3d", ring: true, delay: "1.8s" },
    { id: "motion", src: "/bg-icons/motion.png", className: "node-motion", ring: true, delay: "1.4s" },
    { id: "mobile-ui", src: "/bg-icons/mobile-ui.png", className: "node-mobile-ui", ring: true, delay: "0.6s" },
    { id: "fullstack", src: "/bg-icons/fullstack.png", className: "node-fullstack", delay: "1.5s" },
    { id: "gears", src: "/bg-icons/gears.png", className: "node-gears", delay: "0.5s" },
    { id: "cloud", src: "/bg-icons/cloud.png", className: "node-cloud", delay: "1.1s" },
    { id: "folder", src: "/bg-icons/folder.png", className: "node-folder", delay: "1.9s" },
    { id: "threeD", src: "/bg-icons/threeD.png", className: "node-threeD", delay: "0.9s" },
];

type Route = {
    id: string;
    d: string;
    from?: string;
    to?: string;
};

const routes: Route[] = [
    // Left cluster — essential connections only; laptop is intentionally left open.
    { id: "web-database", from: "web", to: "database", d: "M 13.5 15.5 C 20 13, 28 16, 35 23" },
    { id: "web-phone", from: "web", to: "phone", d: "M 13.5 15.5 C 9 23, 12 34, 20 43" },
    { id: "phone-laptop", from: "phone", to: "laptop", d: "M 20 43 C 16 52, 11 62, 14 70" },

    // Upper bridge — one clean arc instead of several competing paths.
    { id: "database-cloud", from: "database", to: "cloud", d: "M 35 23 C 39 17, 44 12, 49 10" },
    { id: "cloud-design", from: "cloud", to: "design", d: "M 49 10 C 55 8, 61 11, 65 17" },
    { id: "design-3d", from: "design", to: "3d", d: "M 65 17 C 72 13, 80 14, 87 19" },
    { id: "3d-threeD", from: "3d", to: "threeD", d: "M 87 19 C 90 27, 91 36, 90 44" },

    // Right/lower cluster — intentionally fewer paths to keep the centre open.
    { id: "frontend-design", from: "frontend", to: "design", d: "M 74 40 C 74 30, 70 22, 65 17" },
    { id: "frontend-motion", from: "frontend", to: "motion", d: "M 74 40 C 79 48, 80 59, 77 69" },
    { id: "mobile-motion", from: "mobile-ui", to: "motion", d: "M 54 60 C 61 61, 70 65, 77 69" },

    ];

/*
 * A small traveller is attached to EVERY connection.
 * It follows the real SVG path using getPointAtLength().
 */
const travellerDefinitions = routes.map((route, index) => ({
    route: index,
    duration: 11500 + (index % 6) * 1200,
    phase: (index * 0.137) % 1,
    from: route.from!,
    to: route.to!,
}));

const dustParticles = Array.from({ length: 34 }, (_, index) => ({
    id: index,
    x: `${(index * 37 + 9) % 98}%`,
    y: `${(index * 61 + 14) % 96}%`,
    size: `${index % 8 === 0 ? 3 : index % 3 === 0 ? 2 : 1}px`,
    delay: `${-(index * 0.41)}s`,
    duration: `${4.8 + (index % 6) * 0.85}s`,
}));

interface BackgroundProps {
    paused?: boolean;
}

export default function Background({ paused = false }: BackgroundProps) {
    const pathRefs = useRef<Array<SVGPathElement | null>>([]);
    const travellerRefs = useRef<Array<SVGCircleElement | null>>([]);
    const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const timelineStartRef = useRef<number>(performance.now());
    const pausedAtRef = useRef<number | null>(null);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let frame = 0;
        const timers: number[] = [];

        const lengths = pathRefs.current.map(
            (path) => path?.getTotalLength() ?? 0,
        );

        /*
         * Detect the exact end of each path.
         * There is NO independent icon timer anymore.
         * An icon can pop only when a traveller reaches it.
         */
        const previousProgress = travellerDefinitions.map(() => -1);

        if (paused) {
            pausedAtRef.current = performance.now();

            return () => {
                cancelAnimationFrame(frame);
                timers.forEach(window.clearTimeout);
            };
        }

        if (pausedAtRef.current !== null) {
            timelineStartRef.current +=
                performance.now() - pausedAtRef.current;
            pausedAtRef.current = null;
        }

        const pulse = (id: string) => {
            const node = iconRefs.current[id];
            if (!node) return;

            node.classList.remove("is-pulsing");
            void node.offsetWidth;
            node.classList.add("is-pulsing");

            const timer = window.setTimeout(() => {
                node.classList.remove("is-pulsing");
            }, 700);

            timers.push(timer);
        };

        const moveTravellers = (now: number) => {
            travellerDefinitions.forEach((traveller, index) => {
                const path = pathRefs.current[traveller.route];
                const dot = travellerRefs.current[index];
                const length = lengths[traveller.route];

                if (!path || !dot || !length) return;

                const raw =
                    (now - timelineStartRef.current) /
                        traveller.duration +
                    traveller.phase;

                const progress = ((raw % 1) + 1) % 1;
                const previous = previousProgress[index];

                const point = path.getPointAtLength(progress * length);

                dot.setAttribute("cx", String(point.x));
                dot.setAttribute("cy", String(point.y));

                /*
                 * The path begins/ends at the icon centres.
                 * Pop only when the tiny traveller actually reaches an end.
                 */
                if (previous >= 0) {
                    if (previous < 0.975 && progress >= 0.975) {
                        pulse(traveller.to);
                    }

                    if (previous > 0.025 && progress <= 0.025) {
                        pulse(traveller.from);
                    }
                }

                previousProgress[index] = progress;
            });

            frame = requestAnimationFrame(moveTravellers);
        };

        frame = requestAnimationFrame(moveTravellers);

        return () => {
            cancelAnimationFrame(frame);
            timers.forEach(window.clearTimeout);
        };
    }, [paused]);

    return (
        <div
            className={`background-scene ${
                paused ? "background-scene--paused" : ""
            }`}
            aria-hidden="true"
        >
            <svg
                className="connection-lines"
                /*
                 * THIS IS THE IMPORTANT FIX.
                 * Routes are authored in 0–100 coordinates, so the SVG must
                 * use the same coordinate system.
                 */
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {routes.map((route, index) => (
                    <path
                        className="orbit-line"
                        d={route.d}
                        key={route.id}
                        ref={(node) => {
                            pathRefs.current[index] = node;
                        }}
                    />
                ))}

                {travellerDefinitions.map((_, index) => (
                    <circle
                        className="route-traveller"
                        key={index}
                        /*
                         * Tiny dot: roughly 2px on a desktop viewport.
                         */
                        r="0.25"
                        ref={(node) => {
                            travellerRefs.current[index] = node;
                        }}
                    />
                ))}
            </svg>

            <div className="icons-layer">
                {iconNodes.map((icon) => (
                    <div
                        key={icon.id}
                        ref={(node) => {
                            iconRefs.current[icon.id] = node;
                        }}
                        className={`icon-node ${
                            icon.className
                        } ${icon.ring ? "has-ring" : "small-node"}`}
                        style={
                            {
                                "--delay": icon.delay,
                            } as CSSProperties
                        }
                    >
                        {icon.ring && (
                            <>
                                <span className="icon-ring ring-two" />
                            </>
                        )}

                        <img src={icon.src} draggable={false} alt="" />
                    </div>
                ))}
            </div>

            <div className="decor-layer">
                <div className="dust-field">
                    {dustParticles.map((dust) => (
                        <span
                            className="dust-particle"
                            key={dust.id}
                            style={
                                {
                                    "--dust-x": dust.x,
                                    "--dust-y": dust.y,
                                    "--dust-size": dust.size,
                                    "--dust-delay": dust.delay,
                                    "--dust-duration": dust.duration,
                                } as CSSProperties
                            }
                        />
                    ))}
                </div>

                <div className="boxed-label api-label">API</div>
                <div className="boxed-label js-label">JS</div>

                <div className="terminal-symbol">
                    <span className="terminal-dots">•••</span>
                    <span className="terminal-text">&gt;_</span>
                </div>

                <span className="code-symbol code-top">&lt;/&gt;</span>
                <span className="code-symbol code-bottom">{"{}"}</span>

                <span className="plus plus-1">+</span>
                <span className="plus plus-2">+</span>
                <span className="plus plus-3">+</span>
                <span className="plus plus-4">+</span>
                <span className="plus plus-5">+</span>

                <span className="diamond diamond-1" />
                <span className="diamond diamond-2" />
                <span className="diamond diamond-3" />
                <span className="diamond diamond-4" />
                <span className="diamond diamond-5" />
                <span className="diamond diamond-6" />

                <span className="sparkle sparkle-1">✦</span>
                <span className="sparkle sparkle-2">✧</span>
                <span className="sparkle sparkle-3">✦</span>
                <span className="sparkle sparkle-4">✧</span>
                <span className="sparkle sparkle-5">✦</span>

                <span className="dot dot-1" />
                <span className="dot dot-2" />
                <span className="dot dot-3" />
                <span className="dot dot-4" />
                <span className="dot dot-5" />
                <span className="dot dot-6" />
                <span className="dot dot-7" />
                <span className="dot dot-8" />
                <span className="dot dot-9" />
                <span className="dot dot-10" />

                <div className="dot-grid grid-top-right" />
                <div className="dot-grid grid-bottom-left" />
                <div className="dot-grid grid-bottom-center" />

                <span className="cross cross-1">×</span>
                <span className="cross cross-2">×</span>
                <span className="cross cross-3">×</span>
                <span className="cross cross-4">×</span>
            </div>
        </div>
    );
}
