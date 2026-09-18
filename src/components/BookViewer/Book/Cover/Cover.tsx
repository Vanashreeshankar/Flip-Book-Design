import "./Cover.css";

interface CoverProps {
    hover: boolean;

    mouse: {
        x: number;
        y: number;
    };
}

/* =========================================================
   REUSABLE COVER ARTWORK

   Used on both front and back.
   The back is mirrored through CSS.
========================================================= */

export function CoverArtwork() {
    return (
        <>
            {/* =========================================
                SOLID DEEP-TEAL BASE
                Keeps the teal field completely uniform.
            ========================================= */}

            <div
                className="cover__teal-base"
                aria-hidden="true"
            />

            {/* =========================================================
                PREMIUM BOOK-CLOTH / LEATHER SURFACE
                Organic grain + micro pores + directional relief.
                This is deliberately visible at normal cover size.
            ========================================================= */}
            <svg
                className="cover__leather-surface"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    {/* Keep the cloth grain on the teal material only.
                        Without this clip, the full-cover leather texture sits
                        over the bronze and kills its metallic character. */}
                    <clipPath id="tealSurfaceClip">
                        <path
                            d="
                                M 0 0
                                L 61 0
                                C 70 8 66 16 68 23
                                C 70 29 82 35 83 42
                                C 84 48 76 54 73 61
                                C 69 68 73 75 70 82
                                C 68 89 59 94 50 100
                                L 0 100
                                Z
                            "
                        />
                    </clipPath>

                    {/*
                        IMPORTANT:
                        This filter is intentionally built as a visible
                        luminance texture. It does not depend on subtle
                        blend-mode behaviour, so the grain remains visible
                        even when the book is small on screen.
                    */}
                    <filter
                        id="realLeatherGrain"
                        x="-10%"
                        y="-10%"
                        width="120%"
                        height="120%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.035 0.048"
                            numOctaves="5"
                            seed="41"
                            stitchTiles="stitch"
                            result="largeGrain"
                        />

                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.16 0.21"
                            numOctaves="3"
                            seed="89"
                            stitchTiles="stitch"
                            result="fineGrain"
                        />

                        <feBlend
                            in="largeGrain"
                            in2="fineGrain"
                            mode="multiply"
                            result="combined"
                        />

                        <feColorMatrix
                            in="combined"
                            type="saturate"
                            values="0"
                            result="gray"
                        />

                        {/* Increase the separation between pores and fibers. */}
                        <feComponentTransfer in="gray" result="contrastGrain">
                            <feFuncR type="linear" slope="1.75" intercept="-0.38" />
                            <feFuncG type="linear" slope="1.75" intercept="-0.38" />
                            <feFuncB type="linear" slope="1.75" intercept="-0.38" />
                            <feFuncA type="table" tableValues="0.05 0.82" />
                        </feComponentTransfer>
                    </filter>

                    {/* Physical-looking directional relief. */}
                    <filter
                        id="realLeatherRelief"
                        x="-10%"
                        y="-10%"
                        width="120%"
                        height="120%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.045 0.065"
                            numOctaves="4"
                            seed="133"
                            stitchTiles="stitch"
                            result="bump"
                        />

                        <feDiffuseLighting
                            in="bump"
                            surfaceScale="3.2"
                            diffuseConstant="0.75"
                            lighting-color="#ffffff"
                            result="light"
                        >
                            <feDistantLight
                                azimuth="225"
                                elevation="48"
                            />
                        </feDiffuseLighting>

                        <feComponentTransfer in="light">
                            <feFuncA type="table" tableValues="0 0.58" />
                        </feComponentTransfer>
                    </filter>

                    {/* Tiny pore layer. */}
                    <filter
                        id="realLeatherPores"
                        x="-10%"
                        y="-10%"
                        width="120%"
                        height="120%"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.32 0.38"
                            numOctaves="2"
                            seed="217"
                            stitchTiles="stitch"
                        />
                        <feColorMatrix
                            type="saturate"
                            values="0"
                        />
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="2.1" intercept="-0.62" />
                            <feFuncG type="linear" slope="2.1" intercept="-0.62" />
                            <feFuncB type="linear" slope="2.1" intercept="-0.62" />
                            <feFuncA type="table" tableValues="0 0.42" />
                        </feComponentTransfer>
                    </filter>
                </defs>

                <g clipPath="url(#tealSurfaceClip)">
                {/* Dark irregular leather pores. */}
                <rect
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    fill="#061719"
                    filter="url(#realLeatherGrain)"
                />

                {/* Raised fibers catch the light. */}
                <rect
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    fill="#d7ffff"
                    opacity="0.32"
                    filter="url(#realLeatherRelief)"
                />

                {/* Fine pores keep the texture visible at smaller scale. */}
                <rect
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    fill="#001011"
                    opacity="0.42"
                    filter="url(#realLeatherPores)"
                />
                </g>
            </svg>

            {/* =========================================
                COPPER ORGANIC PANEL
            ========================================= */}

            <svg
                className="cover__copper"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>

                    <linearGradient
                        id="copperGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                    >
                        {/* Deep antique bronze: deliberately NOT orange. */}
                        <stop
                            offset="0%"
                            stopColor="#6A4328"
                        />
                        <stop
                            offset="22%"
                            stopColor="#A16B3B"
                        />
                        <stop
                            offset="42%"
                            stopColor="#7B4A2A"
                        />
                        <stop
                            offset="68%"
                            stopColor="#4A2B1A"
                        />
                        <stop
                            offset="86%"
                            stopColor="#704326"
                        />
                        <stop
                            offset="100%"
                            stopColor="#2A180F"
                        />
                    </linearGradient>


                    <linearGradient
                        id="copperLight"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                    >
                        {/* Restrained metallic reflection. */}
                        <stop
                            offset="0%"
                            stopColor="#C88A52"
                            stopOpacity="0.28"
                        />
                        <stop
                            offset="24%"
                            stopColor="#E1B77B"
                            stopOpacity="0.10"
                        />
                        <stop
                            offset="48%"
                            stopColor="#8D5A31"
                            stopOpacity="0.04"
                        />
                        <stop
                            offset="76%"
                            stopColor="#C88A52"
                            stopOpacity="0.16"
                        />
                        <stop
                            offset="100%"
                            stopColor="#24150D"
                            stopOpacity="0.22"
                        />
                    </linearGradient>


                    {/*
                        IMPORTANT: keep the grain clipped to the copper path.
                        The old filter generated noise across its rectangular
                        filter region, which created the unwanted second teal
                        shade on the left side of the copper SVG.
                    */}
                    <filter
                        id="copperGrain"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.075"
                            numOctaves="4"
                            seed="12"
                            stitchTiles="stitch"
                            result="noise"
                        />

                        <feColorMatrix
                            in="noise"
                            type="saturate"
                            values="0"
                            result="grayNoise"
                        />

                        <feComponentTransfer
                            in="grayNoise"
                            result="softNoise"
                        >
                            <feFuncA
                                type="table"
                                tableValues="0 0.075"
                            />
                        </feComponentTransfer>

                        {/* Clip the generated grain to the actual copper shape. */}
                        <feComposite
                            in="softNoise"
                            in2="SourceGraphic"
                            operator="in"
                            result="copperOnlyNoise"
                        />

                        <feBlend
                            in="SourceGraphic"
                            in2="copperOnlyNoise"
                            mode="multiply"
                            result="grainBlend"
                        />

                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.018 0.09"
                            numOctaves="2"
                            seed="27"
                            stitchTiles="stitch"
                            result="fineGrain"
                        />

                        <feColorMatrix
                            in="fineGrain"
                            type="saturate"
                            values="0"
                            result="fineGray"
                        />

                        <feComponentTransfer
                            in="fineGray"
                            result="fineAlpha"
                        >
                            <feFuncA
                                type="table"
                                tableValues="0 0.025"
                            />
                        </feComponentTransfer>

                        <feComposite
                            in="fineAlpha"
                            in2="SourceGraphic"
                            operator="in"
                            result="fineCopperGrain"
                        />

                        <feBlend
                            in="grainBlend"
                            in2="fineCopperGrain"
                            mode="screen"
                        />
                    </filter>

                    <filter
                        id="copperEdgeGlow"
                        x="-40%"
                        y="-10%"
                        width="180%"
                        height="120%"
                    >
                        <feGaussianBlur stdDeviation="0.45" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                </defs>


                {/* Main copper body */}

                <path
                    d="
                        M 61 0
                        L 100 0
                        L 100 100
                        L 50 100

                        C 59 94
                          68 89
                          70 82

                        C 73 75
                          69 68
                          73 61

                        C 76 54
                          84 48
                          83 42

                        C 82 35
                          70 29
                          68 23

                        C 66 16
                          70 8
                          61 0

                        Z
                    "
                    fill="url(#copperGradient)"
                />


                {/* Copper lighting */}

                <path
                    d="
                        M 61 0
                        L 100 0
                        L 100 100
                        L 50 100

                        C 59 94
                          68 89
                          70 82

                        C 73 75
                          69 68
                          73 61

                        C 76 54
                          84 48
                          83 42

                        C 82 35
                          70 29
                          68 23

                        C 66 16
                          70 8
                          61 0

                        Z
                    "
                    fill="url(#copperLight)"
                    opacity="0.58"
                />


                {/* Copper leather grain */}

                <path
                    d="
                        M 61 0
                        L 100 0
                        L 100 100
                        L 50 100

                        C 59 94
                          68 89
                          70 82

                        C 73 75
                          69 68
                          73 61

                        C 76 54
                          84 48
                          83 42

                        C 82 35
                          70 29
                          68 23

                        C 66 16
                          70 8
                          61 0

                        Z
                    "
                    filter="url(#copperGrain)"
                    opacity="0.24"
                />


                {/* Narrow varnish reflection. It follows the existing wave and
                    creates the controlled metallic roll-off seen on premium
                    coated leather without changing the cover geometry. */}
                <path
                    d="
                        M 61 0
                        C 70 8 66 16 68 23
                        C 70 29 82 35 83 42
                        C 84 48 76 54 73 61
                        C 69 68 73 75 70 82
                        C 68 89 59 94 50 100
                    "
                    fill="none"
                    stroke="#D29A5E"
                    strokeWidth="0.32"
                    strokeOpacity="0.62"
                    vectorEffect="non-scaling-stroke"
                    filter="url(#copperEdgeGlow)"
                />

                {/* =====================================
                    COPPER / TEAL SEAM
                ===================================== */}

                <path
                    d="
                        M 61 0

                        C 70 8
                          66 16
                          68 23

                        C 70 29
                          82 35
                          83 42

                        C 84 48
                          76 54
                          73 61

                        C 69 68
                          73 75
                          70 82

                        C 68 89
                          59 94
                          50 100
                    "
                    fill="none"
                    stroke="#B58255"
                    strokeWidth="0.34"
                />


                {/* Bright seam highlight */}

                <path
                    d="
                        M 61.7 0

                        C 70.7 8
                          66.7 16
                          68.7 23

                        C 70.7 29
                          82.7 35
                          83.7 42

                        C 84.7 48
                          76.7 54
                          73.7 61

                        C 69.7 68
                          73.7 75
                          70.7 82

                        C 68.7 89
                          59.7 94
                          50.7 100
                    "
                    fill="none"
                    stroke="#E2C093"
                    strokeWidth="0.16"
                    opacity="0.8"
                />

                {/* Soft secondary reflection gives the bronze edge a
                    physical, machined/foiled transition. */}
                <path
                    d="
                        M 62.5 0
                        C 71.5 8 67.5 16 69.5 23
                        C 71.5 29 83.5 35 84.5 42
                        C 85.5 48 77.5 54 74.5 61
                        C 70.5 68 74.5 75 71.5 82
                        C 69.5 89 60.5 95 51.5 100
                    "
                    fill="none"
                    stroke="#6A422A"
                    strokeWidth="0.42"
                    opacity="0.72"
                />

            </svg>
            {/* =========================================================
                COPPER LEATHER / FOIL RELIEF
                Organic grain clipped to the existing copper wave.
            ========================================================= */}
            <svg
                className="cover__copper-relief"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>

                    <clipPath id="copperReliefClip">
                        <path
                            d="
                                M 61 0
                                L 100 0
                                L 100 100
                                L 50 100
                                C 59 94 68 89 70 82
                                C 73 75 69 68 73 61
                                C 76 54 84 48 83 42
                                C 82 35 70 29 68 23
                                C 66 16 70 8 61 0
                                Z
                            "
                        />
                    </clipPath>

                    <filter
                        id="copperLeatherSurface"
                        x="-12%"
                        y="-12%"
                        width="124%"
                        height="124%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.045 0.068"
                            numOctaves="5"
                            seed="207"
                            stitchTiles="stitch"
                            result="broad"
                        />

                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.17 0.24"
                            numOctaves="3"
                            seed="231"
                            stitchTiles="stitch"
                            result="micro"
                        />

                        <feBlend
                            in="broad"
                            in2="micro"
                            mode="multiply"
                            result="grain"
                        />

                        <feColorMatrix
                            in="grain"
                            type="saturate"
                            values="0"
                            result="gray"
                        />

                        <feComponentTransfer in="gray">
                            <feFuncR
                                type="gamma"
                                amplitude="1.55"
                                exponent="1.6"
                                offset="-0.22"
                            />
                            <feFuncG
                                type="gamma"
                                amplitude="1.55"
                                exponent="1.6"
                                offset="-0.22"
                            />
                            <feFuncB
                                type="gamma"
                                amplitude="1.55"
                                exponent="1.6"
                                offset="-0.22"
                            />
                            <feFuncA
                                type="table"
                                tableValues="0 0.48"
                            />
                        </feComponentTransfer>
                    </filter>

                    <filter
                        id="copperLeatherHighlight"
                        x="-12%"
                        y="-12%"
                        width="124%"
                        height="124%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.065 0.095"
                            numOctaves="4"
                            seed="248"
                            stitchTiles="stitch"
                            result="fibers"
                        />

                        <feSpecularLighting
                            in="fibers"
                            surfaceScale="1.35"
                            specularConstant="0.34"
                            specularExponent="18"
                            lighting-color="#B97843"
                            result="specular"
                        >
                            <feDistantLight
                                azimuth="225"
                                elevation="54"
                            />
                        </feSpecularLighting>

                        <feComponentTransfer in="specular">
                            <feFuncA
                                type="table"
                                tableValues="0 0.20"
                            />
                        </feComponentTransfer>
                    </filter>

                </defs>

                {/* Copper pores */}
                <rect
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    fill="#24160E"
                    opacity="0.34"
                    filter="url(#copperLeatherSurface)"
                    clipPath="url(#copperReliefClip)"
                />

                {/* Metallic raised catch-light */}
                <rect
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    fill="#D39A61"
                    opacity="0.13"
                    filter="url(#copperLeatherHighlight)"
                    clipPath="url(#copperReliefClip)"
                />

            </svg>

            {/* Very soft material sheen. This is a visual-only overlay and
                does not affect the cover geometry or interaction. */}
            <div
                className="cover__material-sheen"
                aria-hidden="true"
            />

            {/* =========================================
                ORNAMENTAL FRAME
            ========================================= */}

            <div className="cover__frame">

          

            </div>


            {/* =========================================
                CENTRAL EMBLEM
            ========================================= */}

            <div className="cover__emblem">

                <span
                    className="
                        cover__diamond
                        cover__diamond--outer
                    "
                />

                <span
                    className="
                        cover__diamond
                        cover__diamond--middle
                    "
                />

                <span
                    className="
                        cover__diamond
                        cover__diamond--inner
                    "
                />


                <span
                    className="
                        cover__emblem-line
                        cover__emblem-line--top
                    "
                />

                <span
                    className="
                        cover__emblem-line
                        cover__emblem-line--bottom
                    "
                />

                <span
                    className="
                        cover__emblem-line
                        cover__emblem-line--left
                    "
                />

                <span
                    className="
                        cover__emblem-line
                        cover__emblem-line--right
                    "
                />


                <span
                    className="
                        cover__emblem-dot
                        cover__emblem-dot--top
                    "
                />

                <span
                    className="
                        cover__emblem-dot
                        cover__emblem-dot--right
                    "
                />

                <span
                    className="
                        cover__emblem-dot
                        cover__emblem-dot--bottom
                    "
                />

                <span
                    className="
                        cover__emblem-dot
                        cover__emblem-dot--left
                    "
                />


                <span className="cover__emblem-center" />

            </div>

        </>
    );
}


export default function Cover({
    hover: _hover,
    mouse: _mouse,
}: CoverProps) {

    return (
        <div className="cover">

            {/* =================================
                FRONT
            ================================= */}

            <div className="cover__front">

                <CoverArtwork />


                {/* =================================
                    FRONT TEXT
                ================================= */}

                <div className="cover__content">

                    <div className="cover__title">
                        CAPABILITIES
                    </div>


                    <div className="cover__subtitle">
                        DIGITAL
                        <span>·</span>
                        DESIGN
                        <span>·</span>
                        DEVELOPMENT
                    </div>


                    <div className="cover__divider">

                        <span />

                        <b>◇</b>

                        <span />

                    </div>


                    <div className="cover__name">
                        VANASHREE
                    </div>


                    <div className="cover__year">

                        <span>—</span>

                        <strong>
                            2026
                        </strong>

                        <span>—</span>

                    </div>


                    <div className="cover__bottom-diamond">
                        ◆
                    </div>

                </div>

            </div>


            {/* =================================
                BACK

                Plain teal back face.
                No artwork, text, or emblem.
            ================================= */}

            <div className="cover__back" aria-hidden="true" />

        </div>
    );
}