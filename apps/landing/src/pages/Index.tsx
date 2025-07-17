import { Hero } from "@/components/landing/Hero";
import { DeveloperNarrative } from "@/components/landing/DeveloperNarrative";
import { RequestResponseFlow } from "@/components/landing/RequestResponseFlow";
import { VariableSystem } from "@/components/landing/VariableSystem";
import { SpeedSection } from "@/components/landing/SpeedSection";
import { Testimonials } from "@/components/landing/Testimonials";
import { FooterCTA } from "@/components/landing/FooterCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <DeveloperNarrative />
      <RequestResponseFlow />
      <VariableSystem />
      <SpeedSection />
      <Testimonials />
      <FooterCTA />
    </div>
  );
};

export default Index;
