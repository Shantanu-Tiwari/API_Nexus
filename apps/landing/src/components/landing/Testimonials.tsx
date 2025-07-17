import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Feels like Postman if it were designed in 2025.",
    author: "@devjane"
  },
  {
    quote: "Finally, an API client that doesn't get in my way.",
    author: "@codesmith"
  },
  {
    quote: "This is what I've been waiting for. Clean, fast, local.",
    author: "@apiwhiz"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-muted/20">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          From the terminal
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="border-l-2 border-border pl-4 space-y-2"
            >
              <p className="text-muted-foreground italic text-sm md:text-base leading-relaxed">
                "{testimonial.quote}"
              </p>
              <footer className="font-mono text-xs text-muted-foreground">
                {testimonial.author}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};