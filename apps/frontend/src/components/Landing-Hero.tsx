import { HeroSection } from "./hero-section";
import { Icons } from "./ui/icons";

export function LandingHero() {
  return (
    <HeroSection
      badge={{
        text: "Build on Avalanche Network",
        action: {
          text: "Chech it Out",
          href: "https://www.avax.network/",
        },
      }}
      title="BID - Buy, Interact and Deal"
      description="Enjoy the freedom of selling your products from the comport of your dorms."
      actions={[
        {
          text: "Get Started",
          href: "/",
          variant: "default",
        },
        {
          text: "GitHub",
          href: "https://github.com/Puskar-Roy/BID",
          variant: "glow",
          icon: <Icons.gitHub className="h-5 w-5" />,
        },
      ]}
      image={{
        src: "https://5th3z5etgf.ufs.sh/f/FwvFTTfPEf2iOpM3Fqu2TtW5RCoXlEkg6YF8BjAyHfpeMPuG", // Always using the dark theme image
        alt: "UI Components Preview",
      }}
    />
  );
}
