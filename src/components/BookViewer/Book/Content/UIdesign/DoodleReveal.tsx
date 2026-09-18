import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import "./DoodleReveal.css";

interface DoodleRevealProps {
  children: ReactNode;
}

const COMPLETE_COVERAGE = 0.70;

const GRID_COLUMNS = 80;
const GRID_ROWS = 50;

const REVEAL_RADIUS = 54;
const REVEAL_STROKE_WIDTH = 108;
const MASK_UPDATE_INTERVAL = 45;

const DOODLE_EVENT = "ui-design-doodle-progress";

const revealedCells = new Set<string>();

let activeInstances = 0;

function makeCellKey(
  side: "left" | "right",
  column: number,
  row: number
) {
  return `${side}:${column}:${row}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const TOTAL_CELLS = GRID_COLUMNS * GRID_ROWS * 2;

export default function DoodleReveal({
  children,
}: DoodleRevealProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const doodleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const revealCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sharpContentRef = useRef<HTMLDivElement | null>(null);

  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastMaskUpdateRef = useRef(0);

  const sideRef = useRef<"left" | "right">("right");

  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  /*
   * Doodle typography fade:
   * 0% reveal   -> 100% visible
   * 20% reveal  -> 80% visible
   * 50% reveal  -> 37.5% visible
   * 80% reveal  -> 0% visible
   *
   * The text fades independently from the page reveal.
   */
  const doodleTextOpacity = clamp(
    1 - progress * 1.25,
    0,
    1
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const leftPage = wrapper.querySelector(".ui-left");
    sideRef.current = leftPage ? "left" : "right";
  }, []);

  useEffect(() => {
    activeInstances += 1;

    if (activeInstances === 1) {
      revealedCells.clear();
    }

    return () => {
      activeInstances -= 1;

      if (activeInstances <= 0) {
        activeInstances = 0;
        revealedCells.clear();
      }
    };
  }, []);

  useEffect(() => {
    const handleProgress = (event: Event) => {
      const customEvent = event as CustomEvent<{
        progress: number;
        complete: boolean;
      }>;

      const nextProgress = customEvent.detail?.progress ?? 0;

      setProgress(nextProgress);

      if (customEvent.detail?.complete) {
        setIsComplete(true);
      }
    };

    window.addEventListener(DOODLE_EVENT, handleProgress);

    return () => {
      window.removeEventListener(DOODLE_EVENT, handleProgress);
    };
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const doodleCanvas = doodleCanvasRef.current;
    const revealCanvas = revealCanvasRef.current;

    if (!wrapper || !doodleCanvas || !revealCanvas) return;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();

      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      doodleCanvas.width = Math.round(width * dpr);
      doodleCanvas.height = Math.round(height * dpr);
      doodleCanvas.style.width = `${width}px`;
      doodleCanvas.style.height = `${height}px`;

      revealCanvas.width = Math.round(width * dpr);
      revealCanvas.height = Math.round(height * dpr);
      revealCanvas.style.width = `${width}px`;
      revealCanvas.style.height = `${height}px`;

      const revealContext = revealCanvas.getContext("2d");

      if (!revealContext) return;

      revealContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      revealContext.clearRect(0, 0, width, height);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);

    window.addEventListener("resize", resize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  const applyMask = () => {
    const maskCanvas = revealCanvasRef.current;
    const sharpContent = sharpContentRef.current;

    if (!maskCanvas || !sharpContent) return;

    const now = performance.now();

    if (
      now - lastMaskUpdateRef.current <
      MASK_UPDATE_INTERVAL
    ) {
      return;
    }

    lastMaskUpdateRef.current = now;

    try {
      const maskUrl = maskCanvas.toDataURL("image/png");

      sharpContent.style.maskImage = `url("${maskUrl}")`;
      sharpContent.style.webkitMaskImage = `url("${maskUrl}")`;
    } catch {
      // Ignore mask update errors.
    }
  };

  const getCoverage = () => {
    return clamp(
      revealedCells.size / TOTAL_CELLS,
      0,
      1
    );
  };

  const markArea = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const side = sideRef.current;

    const centerColumn = Math.floor(
      (x / width) * GRID_COLUMNS
    );

    const centerRow = Math.floor(
      (y / height) * GRID_ROWS
    );

    const radiusX = Math.max(
      1,
      Math.ceil(
        (REVEAL_RADIUS / width) * GRID_COLUMNS
      )
    );

    const radiusY = Math.max(
      1,
      Math.ceil(
        (REVEAL_RADIUS / height) * GRID_ROWS
      )
    );

    for (
      let row = centerRow - radiusY;
      row <= centerRow + radiusY;
      row++
    ) {
      if (row < 0 || row >= GRID_ROWS) continue;

      for (
        let column = centerColumn - radiusX;
        column <= centerColumn + radiusX;
        column++
      ) {
        if (
          column < 0 ||
          column >= GRID_COLUMNS
        ) {
          continue;
        }

        const dx =
          (column - centerColumn) / radiusX;

        const dy =
          (row - centerRow) / radiusY;

        if (dx * dx + dy * dy <= 1) {
          revealedCells.add(
            makeCellKey(
              side,
              column,
              row
            )
          );
        }
      }
    }
  };

  const broadcast = (
    nextProgress: number,
    complete: boolean
  ) => {
    window.dispatchEvent(
      new CustomEvent(DOODLE_EVENT, {
        detail: {
          progress: nextProgress,
          complete,
        },
      })
    );
  };

  const completeReveal = () => {
    if (isComplete) return;

    drawingRef.current = false;

    setProgress(1);
    setIsComplete(true);

    const sharpContent = sharpContentRef.current;

    if (sharpContent) {
      sharpContent.style.maskImage = "none";
      sharpContent.style.webkitMaskImage = "none";
    }

    const doodleCanvas = doodleCanvasRef.current;

    if (doodleCanvas) {
      const context = doodleCanvas.getContext("2d");

      if (context) {
        context.clearRect(
          0,
          0,
          doodleCanvas.width,
          doodleCanvas.height
        );
      }
    }

    broadcast(1, true);
  };

  const getPoint = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = doodleCanvasRef.current;

    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  /*
   * The pointer behaves like an eraser.
   *
   * IMPORTANT:
   * Nothing is drawn onto the visible page.
   * White is painted only onto the invisible
   * reveal mask.
   */
  const eraseReveal = (
    context: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => {
    context.save();

    context.strokeStyle = "rgba(255,255,255,1)";
    context.lineWidth = REVEAL_STROKE_WIDTH;
    context.lineCap = "round";
    context.lineJoin = "round";

    context.beginPath();

    context.moveTo(
      from.x,
      from.y
    );

    context.lineTo(
      to.x,
      to.y
    );

    context.stroke();

    context.beginPath();

    context.arc(
      to.x,
      to.y,
      REVEAL_STROKE_WIDTH / 2,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      "rgba(255,255,255,1)";

    context.fill();

    context.restore();
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    if (isComplete) return;

    const doodleCanvas = doodleCanvasRef.current;
    const revealCanvas = revealCanvasRef.current;

    if (!doodleCanvas || !revealCanvas) return;

    const revealContext =
      revealCanvas.getContext("2d");

    if (!revealContext) return;

    const point = getPoint(event);

    if (!point) return;

    doodleCanvas.setPointerCapture(
      event.pointerId
    );

    drawingRef.current = true;

    lastPointRef.current = point;

    revealContext.beginPath();

    revealContext.arc(
      point.x,
      point.y,
      REVEAL_STROKE_WIDTH / 2,
      0,
      Math.PI * 2
    );

    revealContext.fillStyle =
      "rgba(255,255,255,1)";

    revealContext.fill();

    markArea(
      point.x,
      point.y,
      doodleCanvas.clientWidth,
      doodleCanvas.clientHeight
    );

    const coverage = getCoverage();

    const nextProgress = clamp(
      coverage / COMPLETE_COVERAGE,
      0,
      1
    );

    setProgress(nextProgress);

    applyMask();

    broadcast(
      nextProgress,
      false
    );

    if (
      coverage >= COMPLETE_COVERAGE
    ) {
      completeReveal();
    }
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    if (
      !drawingRef.current ||
      isComplete
    ) {
      return;
    }

    event.preventDefault();

    const doodleCanvas = doodleCanvasRef.current;
    const revealCanvas = revealCanvasRef.current;

    if (!doodleCanvas || !revealCanvas) return;

    const revealContext =
      revealCanvas.getContext("2d");

    if (!revealContext) return;

    const currentPoint = getPoint(event);
    const lastPoint = lastPointRef.current;

    if (!currentPoint || !lastPoint) return;

    const dx =
      currentPoint.x - lastPoint.x;

    const dy =
      currentPoint.y - lastPoint.y;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );

    if (distance < 1) return;

    /*
     * Eraser action.
     *
     * There is intentionally no visible
     * scratch/doodle stroke.
     */
    eraseReveal(
      revealContext,
      lastPoint,
      currentPoint
    );

    /*
     * Sample the path so fast mouse movement
     * cannot leave gaps in the reveal.
     */
    const sampleDistance = Math.max(
      7,
      REVEAL_RADIUS * 0.22
    );

    const samples = Math.max(
      1,
      Math.ceil(
        distance / sampleDistance
      )
    );

    for (
      let index = 1;
      index <= samples;
      index++
    ) {
      const t = index / samples;

      const sampleX =
        lastPoint.x + dx * t;

      const sampleY =
        lastPoint.y + dy * t;

      markArea(
        sampleX,
        sampleY,
        doodleCanvas.clientWidth,
        doodleCanvas.clientHeight
      );
    }

    lastPointRef.current =
      currentPoint;

    const coverage = getCoverage();

    const nextProgress = clamp(
      coverage / COMPLETE_COVERAGE,
      0,
      1
    );

    setProgress(nextProgress);

    applyMask();

    broadcast(
      nextProgress,
      false
    );

    if (
      coverage >= COMPLETE_COVERAGE
    ) {
      completeReveal();
    }
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    drawingRef.current = false;
    lastPointRef.current = null;

    const canvas =
      doodleCanvasRef.current;

    if (
      canvas &&
      canvas.hasPointerCapture(
        event.pointerId
      )
    ) {
      canvas.releasePointerCapture(
        event.pointerId
      );
    }
  };

  const handlePointerCancel = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    drawingRef.current = false;
    lastPointRef.current = null;

    const canvas =
      doodleCanvasRef.current;

    if (
      canvas &&
      canvas.hasPointerCapture(
        event.pointerId
      )
    ) {
      canvas.releasePointerCapture(
        event.pointerId
      );
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={[
        "doodle-reveal",
        isComplete
          ? "doodle-reveal-complete"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Blurred original */}
      <div className="doodle-reveal-content">
        {children}
      </div>

      {/* Sharp duplicate revealed through the mask */}
      <div
        ref={sharpContentRef}
        className="doodle-reveal-sharp-content"
        aria-hidden="true"
      >
        {children}
      </div>

      <div
        className="doodle-interaction-layer"
        aria-hidden="true"
      >
        {/* Left typography */}
        <div
          className="doodle-reveal-heading"
          style={{
            opacity: doodleTextOpacity,
            transition: "opacity 0.35s ease-out",
          }}
        >
          <span className="doodle-word">
            DOD
          </span>

          <span className="doodle-instruction">
            DRAW TO
          </span>
        </div>

        {/* Right typography */}
        <div
          className="doodle-right-text"
          style={{
            opacity: doodleTextOpacity,
            transition: "opacity 0.35s ease-out",
          }}
        >
          <span className="doodle-right-word">
            DLE
          </span>

          <span className="doodle-right-instruction">
            REVEAL
          </span>
        </div>

        {/*
          Invisible interaction surface.

          It does NOT draw a scratch line.
          It only receives pointer events.
        */}
        <canvas
          ref={doodleCanvasRef}
          className="doodle-canvas"
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
          onPointerCancel={
            handlePointerCancel
          }
          onContextMenu={(event) =>
            event.preventDefault()
          }
        />

        {/* Invisible reveal mask */}
        <canvas
          ref={revealCanvasRef}
          className="doodle-reveal-mask"
          aria-hidden="true"
        />

        <div className="doodle-progress">
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
}
