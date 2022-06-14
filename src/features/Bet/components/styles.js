import { motion } from "framer-motion";

const x = "-50%";
const y = "-100%";
const betContainerVariants = {
  hidden: { scale: 0, x, y },
  visible: { scale: 1, x, y },
};

// Nothing yet
export const BetContainer = ({ children, bet = 0 }) => {
  const style = { left: "50%" };

  return (
    <motion.div
      animate={bet ? "visible" : "hidden"}
      className={`absolute p-2 bg-accent-focus rounded-full text-center w-[5rem] bottom-6`}
      initial="hidden"
      style={style}
      variants={betContainerVariants}
    >
      {children}
    </motion.div>
  );
};
