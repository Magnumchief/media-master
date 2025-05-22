import { motion } from "framer-motion";

export function Preloader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-primary overflow-hidden">
      <div className="relative">
        {/* Animated background glow */}
        <motion.div
          className="absolute -inset-10 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0) 70%)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <div className="flex flex-col items-center z-10 relative">
          {/* Logo container with pulse animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="mb-10"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 rgba(255,255,255, 0.4)",
                  "0 0 20px rgba(255,255,255, 0.6)",
                  "0 0 0 rgba(255,255,255, 0.4)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 bg-white rounded-xl flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-primary font-bold text-4xl"
              >
                DI
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Loading text with fade animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center"
          >
            <h3 className="text-white text-xl font-medium mb-2">Digital Influence</h3>
          </motion.div>
          
          {/* Loading dots animation */}
          <div className="flex justify-center space-x-2 mt-2">
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className="w-2 h-2 bg-white rounded-full"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: dot * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="mt-6 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}