import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const FooterCTA = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Grid pattern with radial gradient fade */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          mask: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
          WebkitMask: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)'
        }}
      />
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Ready to test?
          </h2>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {/* The Button is now wrapped in an anchor tag */}
                <a
                    href="https://api-nexus-dashboard-kappa.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        size="lg"
                        className="gap-2 px-8 py-4 text-lg"
                        // The onClick handler is removed
                    >
                        Launch Workspace
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </a>
            </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-20 pt-8 border-t text-center space-y-4"
      >
        <p className="text-sm text-muted-foreground">
          No accounts. No tracking. Just testing.
        </p>

        <p className="text-xs text-muted-foreground">
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/shantanutiwari24/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline decoration-dotted"
          >
            Shantanu Tiwari
          </a>
        </p>
      </motion.footer>
    </section>
  );
};