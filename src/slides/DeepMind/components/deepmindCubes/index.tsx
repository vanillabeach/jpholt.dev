import * as THREE from 'three';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from './styles.module.css';
import { isWithinViewport } from '../../../../utils';

const BLUE = 0x0d58d3;
const GREY = 0xffffff;
const MAX_CUBES = 150;

function generateMeshes(): THREE.Mesh[] {
  const material = (count: number) =>
    new THREE.MeshStandardMaterial({
      metalness: 0.5,
      flatShading: false,
      roughness: 0.3,
      color: new THREE.Color(count % 3 === 0 ? GREY : BLUE),
    });
  const meshes: THREE.Mesh[] = [];

  for (let count = 0; count < MAX_CUBES; count += 1) {
    const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const mesh = new THREE.Mesh(geometry, material(count));
    mesh.position.set(Math.random() / 3 - 0.15, Math.random() * 5, Math.random() / 2);
    meshes.push(mesh);
  }

  return meshes;
}

export interface DeepMindCubesProps {
  slideContainer: HTMLDivElement | null;
}

export default function DeepMindCubes(props: DeepMindCubesProps) {
  const { slideContainer } = props;
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [scene, setScene] = useState<THREE.Scene>();
  const light1 = useMemo(() => new THREE.SpotLight(0xffffff, 0.8), []);
  const light2 = useMemo(() => new THREE.SpotLight(0xffffff, 0.4), []);
  const light3 = useMemo(() => new THREE.SpotLight(0xffffff, 0.4), []);
  const meshes = useState<THREE.Mesh[]>(generateMeshes())[0];

  const getYOffset = useCallback(() => {
    if (!slideContainer) {
      return 0;
    }

    return slideContainer.getBoundingClientRect().top;
  }, [slideContainer]);

  const setYPos = useCallback(() => {
    if (!camera) {
      return;
    }
    camera.position.y = 1 - getYOffset() / -1000;
    light1.position.setY(-0.1 - getYOffset() / -180);
    light2.position.setY(1.2 - getYOffset() / -120);
    light3.position.setY(0.8 - getYOffset() / -140);
  }, [camera, getYOffset, light1.position, light2.position, light3.position]);

  useEffect(() => {
    if (!canvasContainerRef?.current) {
      return;
    }

    const canvasContainer = canvasContainerRef.current;
    const _camera = new THREE.PerspectiveCamera(
      70,
      canvasContainer.offsetWidth / canvasContainer.offsetHeight,
      0.01,
      10
    );
    _camera.position.z = 0.9;
    setCamera(_camera);

    const _scene = new THREE.Scene();

    meshes.forEach((mesh) => {
      _scene.add(mesh);
    });

    light1.position.set(0.2, -0.1, 1.0);
    light1.castShadow = true;
    _scene.add(light1);

    light2.position.set(0.3, 1.2, 0.8);
    light2.castShadow = true;
    _scene.add(light2);

    light3.position.set(0.1, 0.8, 0.2);
    light3.castShadow = true;
    _scene.add(light3);

    setScene(_scene);

    const _renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });
    _renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    setRenderer(_renderer);
  }, [canvasContainerRef, light1, light2, light3, meshes]);

  useEffect(() => {
    if (!renderer || !canvasContainerRef?.current || !scene || !camera) {
      return;
    }
    if (canvasContainerRef.current.hasChildNodes() === false) {
      canvasContainerRef.current.appendChild(renderer.domElement);
    }
    setYPos();
    renderer.render(scene, camera);
  }, [renderer, canvasContainerRef, camera, scene, setYPos]);

  useEffect(() => {
    const scroll = () => {
      if (!scene || !camera || !renderer || !slideContainer) {
        return;
      }
      if (!canvasContainerRef?.current || !isWithinViewport(canvasContainerRef.current)) {
        return;
      }

      setYPos();
      renderer.render(scene, camera);
    };

    const resize = () => {
      if (!scene || !camera || !renderer || !slideContainer) {
        return;
      }
      if (!canvasContainerRef?.current || !isWithinViewport(canvasContainerRef.current)) {
        return;
      }
      const canvasContainer = canvasContainerRef.current;

      renderer.setSize(0, 0);
      requestAnimationFrame(() => {
        const { offsetWidth, offsetHeight } = slideContainer;
        const width = offsetWidth / 2;
        const height = offsetHeight;
        canvasContainer.style.width = `${width}px`;
        canvasContainer.style.height = `${height}px`;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.render(scene, camera);
      });
    };

    window.addEventListener('scroll', scroll);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', resize);
    };
  }, [camera, renderer, scene, setYPos, slideContainer]);

  return <div className={classNames.art} ref={canvasContainerRef}></div>;
}
