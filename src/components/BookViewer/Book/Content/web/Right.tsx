import { motion } from "framer-motion";
import "./Right.css";

export default function WebRight() {
    return (
        <section className="home-back">

            {/* --------------------------------
                TOP PAGE NUMBER
            -------------------------------- */}

            <motion.div
                className="back-number"
                initial={{
                    opacity: 0,
                    y: -6,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.5,
                }}
            >
                <span />
                <b>02</b>
            </motion.div>


            {/* --------------------------------
                TEAL UNDER-LAYER
            -------------------------------- */}

            <motion.div
                className="back-curved-layer"
                initial={{
                    x: -12,
                    opacity: 0,
                }}
                animate={{
                    x: 0,
                    opacity: 1,
                }}
                transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                }}
            />


            {/* --------------------------------
                IVORY CURVED INSERT
            -------------------------------- */}

            <motion.div
                className="back-ivory-page"
                initial={{
                    x: -10,
                    opacity: 0,
                }}
                animate={{
                    x: 0,
                    opacity: 1,
                }}
                transition={{
                    delay: 0.05,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >

                {/* Main ivory text */}

                <div className="back-page-content">

                    <div className="back-small-line" />

                    <div className="back-message">
                        <span>WEBSITES</span>
                        <span>THAT</span>
                        <span>WORK</span>

                        <span className="accent">
                            BEAUTIFULLY.
                        </span>
                    </div>

                </div>


                {/* Bottom keywords */}

                <div className="back-keywords">
                    <span>DESIGN</span>
                    <span>DEVELOP</span>
                    <span>DEPLOY</span>
                    <span>GROW</span>
                </div>

            </motion.div>


            {/* --------------------------------
                RIGHT GREEN COPY
            -------------------------------- */}

            <motion.div
                className="back-right-copy"
                initial={{
                    opacity: 0,
                    x: 8,
                }}
                animate={{
                    opacity: 1,
                    x: 0,
                }}
                transition={{
                    delay: 0.25,
                    duration: 0.6,
                }}
            >

                <div className="back-copy-top">
                    <span>CLEAN</span>
                    <span>MODERN</span>
                    <span>MEANINGFUL</span>
                    <span>SCALABLE</span>
                </div>


                <div className="back-copy-line" />


                <div className="back-copy-bottom">
                    <span>BUILDING</span>
                    <span>A BRIGHTER</span>
                    <span>DIGITAL TOMORROW</span>
                </div>


                <div className="back-copy-bottom-line" />

            </motion.div>

        </section>
    );
}