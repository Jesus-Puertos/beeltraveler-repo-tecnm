import MagicBento from "@/components/ui/animated/MagicBento";

export default function AboutSection() {
  return (
    <section className="my-20">
      <h2 className="text-center text-4xl font-bold text-primary-a0 dark:text-accent-a0 mb-10">
        Misión · Visión · Valores
      </h2>

      <MagicBento
        textAutoHide={false}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={true}
        enableMagnetism={true}
        clickEffect={true}
        spotlightRadius={300}
        particleCount={12}
        glowColor="6, 95, 70" 
      />
    </section>
  );
}
