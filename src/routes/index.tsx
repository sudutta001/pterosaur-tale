import { createFileRoute } from "@tanstack/react-router";
import { PrehistoricLanding } from "@/components/PrehistoricLanding";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "The Sky Went Quiet — A Pterosaur Story" },
      { name: "description", content: "A cinematic scroll through the final age of the pterosaurs, brought to life with a moving 3D specimen." },
      { property: "og:title", content: "The Sky Went Quiet — A Pterosaur Story" },
      { property: "og:description", content: "A cinematic scroll through the final age of the pterosaurs, brought to life with a moving 3D specimen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrehistoricLanding,
});
