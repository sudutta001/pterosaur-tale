import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PterosaurScene } from "./PterosaurScene";

const chapters = [
  {
    number: "01",
    era: "The age of open sky",
    title: "Before the silence, there was flight.",
    copy: "For more than 150 million years, pterosaurs rode warm air above the ancient continents. Their wings were skin, their bones were hollow, and the horizon belonged to them.",
  },
  {
    number: "02",
    era: "66 million years ago",
    title: "The light changed first.",
    copy: "An asteroid struck what is now the Yucatán. Dust rose into the atmosphere, the sun thinned to a pale coin, and the thermals that lifted the largest flyers began to fail.",
  },
  {
    number: "03",
    era: "The last season",
    title: "A wing folds once.",
    copy: "Food webs collapsed. The final pterosaurs crossed a cooling sky with nowhere left to land. Their extinction was not a single moment, but a long descent into stillness.",
  },
];

export function PrehistoricLanding() {
  const progressRef = useRef(0);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const element = pageRef.current;
      if (!element) return;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      progressRef.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      element.style.setProperty("--story-progress", `${progressRef.current}`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={pageRef} className="prehistoric-page">
      <div className="scene-shell" aria-hidden="true">
        <Canvas camera={{ position: [0, 0.1, 8.6], fov: 34 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
          <PterosaurScene progressRef={progressRef} />
        </Canvas>
      </div>

      <div className="atmosphere" aria-hidden="true">
        <div className="sun-disc" />
        <div className="mountain mountain-back" />
        <div className="mountain mountain-front" />
        <div className="cloud cloud-one" />
        <div className="cloud cloud-two" />
      </div>

      <header className="site-header">
        <span className="wordmark">A FIELD RECORD</span>
        <span className="header-date">66,000,000 YEARS AGO</span>
      </header>

      <div className="scroll-line" aria-hidden="true">
        <span />
      </div>

      <main>
        <section className="opening chapter-screen">
          <div className="opening-copy">
            <p className="eyebrow">Pterosauria / last light</p>
            <h1>The sky<br /><em>went quiet.</em></h1>
            <p className="lede">A small story about the largest creatures ever to fly — and the world that could no longer hold them.</p>
            <div className="scroll-prompt"><span className="prompt-line" />Scroll to descend</div>
          </div>
        </section>

        {chapters.map((chapter) => (
          <section className="story-section chapter-screen" key={chapter.number}>
            <div className="chapter-copy">
              <span className="chapter-number">{chapter.number}</span>
              <p className="eyebrow">{chapter.era}</p>
              <h2>{chapter.title}</h2>
              <p>{chapter.copy}</p>
            </div>
          </section>
        ))}

        <section className="closing chapter-screen">
          <div className="closing-copy">
            <p className="eyebrow">The record remains</p>
            <h2>What vanishes<br /><em>leaves a shape.</em></h2>
            <p>In fossil beds, the last flight is still turning — waiting for us to look up.</p>
            <span className="closing-rule" />
            <small>Specimen study / Pterosauria</small>
          </div>
        </section>
      </main>
    </div>
  );
}