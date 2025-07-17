import { motion } from "framer-motion";

const speedPoints = [
  "→ 200ms cold start. Everything offline.",
  "→ Cmd + Enter. Request sent.",
  "→ Auto-saves. Always.",
  "→ No accounts. No tracking. No BS."
];

export const SpeedSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-16"
        >
          Built for speed
        </motion.h2>

        <div className="space-y-8">
          {speedPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="font-mono text-lg md:text-xl leading-7 text-muted-foreground text-left max-w-md mx-auto"
            >
              {point}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};