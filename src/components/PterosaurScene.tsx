import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, useGLTF, useProgress, Html } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import pterosaurAsset from "@/assets/pterosaur.gltf.asset.json";

const MODEL_URL = pterosaurAsset.url;

type PterosaurSceneProps = {
  progressRef: React.MutableRefObject<number>;
};

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="model-loader">
        <span>{Math.round(progress)}%</span>
        <span>awakening specimen</span>
      </div>
    </Html>
  );
}

function Pterosaur({ progressRef }: PterosaurSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const { scene } = useGLTF(MODEL_URL);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const targetSize = Math.min(2.8, viewport.width * 0.5);
    clone.scale.setScalar(targetSize / Math.max(size.y, size.x, size.z, 1));
    const scaledBounds = new THREE.Box3().setFromObject(clone);
    const center = scaledBounds.getCenter(new THREE.Vector3());
    clone.position.sub(center);
    return clone;
  }, [scene]);

  useEffect(() => {
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }, [model]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const progress = progressRef.current;
    const time = clock.getElapsedTime();
    const targetX = -0.16 + progress * Math.PI * 1.72;
    const targetY = Math.sin(time * 0.7) * 0.1 + progress * Math.PI * 0.28;
    const targetZ = Math.sin(time * 0.55) * 0.045 - progress * 0.16;
    const easing = 1 - Math.exp(-5 * delta);

    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, easing);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, easing);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetZ, easing);
    const isDesktop = viewport.width > 5;
    const finalChapterProgress = Math.max(0, (progress - 0.84) / 0.16);
    const targetPositionX = isDesktop
      ? 1.15 - finalChapterProgress * 2.25
      : 0.25 - finalChapterProgress * 0.5;
    group.position.x = THREE.MathUtils.lerp(group.position.x, targetPositionX, easing);
    group.position.y = THREE.MathUtils.lerp(group.position.y, Math.sin(time * 0.9) * 0.09, easing);
  });

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

export function PterosaurScene({ progressRef }: PterosaurSceneProps) {
  return (
    <>
      <color attach="background" args={["#071513"]} />
      <fog attach="fog" args={["#071513", 9, 22]} />
      <ambientLight intensity={1.35} color="#b9d3c4" />
      <directionalLight
        position={[4, 7, 5]}
        intensity={3.2}
        color="#f2c77c"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-4, 1, 3]} intensity={2.2} color="#5caa9c" />
      <Environment resolution={256}>
        <color attach="background" args={["#071513"]} />
        <Lightformer intensity={2} position={[3, 5, 2]} scale={[5, 5, 1]} color="#f2c77c" />
        <Lightformer intensity={1.5} position={[-4, 1, -2]} scale={[4, 4, 1]} color="#4b8f83" />
      </Environment>
      <Float speed={0.65} rotationIntensity={0.06} floatIntensity={0.18}>
        <Suspense fallback={<Loader />}>
          <Pterosaur progressRef={progressRef} />
        </Suspense>
      </Float>
    </>
  );
}

useGLTF.preload(MODEL_URL);