import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col relative overflow-hidden">
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
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between p-6 md:p-8 relative z-10"
      >
        <div className="font-semibold tracking-tight">API Workspace</div>
        <a 
          href="https://github.com/Shantanu-Tiwari" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="sm" className="gap-2">
            <Github className="h-4 w-4" />
            GitHub
          </Button>
        </a>
      </motion.nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="text-center max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6"
          >
            Your API workflows.{" "}
            <span className="text-muted-foreground">Cleaner, faster, local.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
          >
            Instant, tabbed, Postman-grade workspace. No login.
          </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
                {/* The Button is now wrapped in an anchor tag to handle navigation */}
                <a
                    href="https://api-nexus-dashboard-kappa.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        size="lg"
                        className="gap-2 px-8 py-3 text-base"
                        // The onClick handler has been removed
                    >
                        Launch Workspace
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </a>
                <a
                    href="https://github.com/Shantanu-Tiwari"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="ghost" size="lg" className="gap-2 px-8 py-3 text-base">
                        GitHub
                        <Github className="h-4 w-4" />
                    </Button>
                </a>
            </motion.div>
        </div>
      </div>
    </section>
  );
};