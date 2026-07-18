import { motion } from "motion/react"

export default function Curtain ({
    children,
    className='',
    Icon= null,
    color="#0ea5e9",
    onClick=null,
    title=null,
    direction='center'

}) {

    const customVariants={
            rest: { scaleX: 0 },
            hover: { scaleX: 1 },
            }

    return(
        <motion.button
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 1.5 }}
         onClick={onClick}
         title={title}
        className={` relative overflow-hidden ${className}`}
        >
        {/* curtain layer */}
        <motion.span
            variants={customVariants}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
            position: "absolute",
            inset: 0,
            background: color, 
            transformOrigin: direction,
            }}
        />

        {/* content, stays above the curtain */}
       <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {Icon && <Icon className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
      </span>
        </motion.button>
   
    )
}