import { motion, useInView } from "motion/react"
import { useRef } from "react"

export default function Scroll({children}){
    const ref = useRef(null)

    const isInView = useInView(ref, {once: true})

    return(
        <>
        <motion.div
        ref={ref}
        initial={{opacity: 0, y: 100}}
        animate={isInView ? {opacity: 1, y:0}: {}}
        transition={{duration: 0.8, ease: 'easeOut', delay: 0.2}}
        >
            {children}
        </motion.div>
        </>
    )
}