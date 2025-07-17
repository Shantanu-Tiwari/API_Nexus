import { motion } from "framer-motion";

const narrativeItems = [
  "Built for the 3 a.m. debugger.",
  "For the CLI lover who hates mouse clicks.",
  "For the developer who speaks in JSON.",
  "For workflows that just work."
];

export const DeveloperNarrative = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {narrativeItems.map((text, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-2xl md:text-3xl font-medium leading-relaxed text-muted-foreground"
            >
              {text}
            </motion.p>
          ))}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pt-8"
          >
            <div className="font-mono text-xl md:text-2xl font-bold tracking-wider">
              JSON IN → RESPONSE OUT
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};