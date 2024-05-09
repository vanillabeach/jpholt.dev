import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isWithinViewport } from '../../../../utils';
import classNames from './styles.module.css';

const loader = new GLTFLoader();

function modelLoader(url: string): Promise<THREE.Group<THREE.Object3DEventMap>> {
  return new Promise((resolve, reject) => {
    loader.load(url, (data) => resolve(data.scene), undefined, reject);
  });
}

export interface LogoParams {
  parentContainer: HTMLDivElement | null;
}

export default function Logo(params: LogoParams) {
  const { parentContainer } = params;
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [scene, setScene] = useState<THREE.Scene>();
  const [logoPieces, setLogoPieces] = useState<Array<THREE.Group<THREE.Object3DEventMap>>>(null!);
  const [logoPiecePositions, setLogoPiecePositions] = useState<Array<number>>(null!);
  const logoPieceSpeeds = useMemo(() => [35, 77, 48, 10, 56, 42, 67, 81, 95], []);
  const [piecesReady, setPiecesReady] = useState<boolean>(false);
  const [piecesAdded, setPiecesAdded] = useState<boolean>(false);
  const light1 = useMemo(() => new THREE.SpotLight(0xff00f0, 255), []);
  const light2 = useMemo(() => new THREE.SpotLight(0x0d58d3, 255), []);

  const loadLogo = useCallback(async () => {
    const pieces = [
      await modelLoader('/models/channel4.0.glb'),
      await modelLoader('/models/channel4.1.glb'),
      await modelLoader('/models/channel4.2.glb'),
      await modelLoader('/models/channel4.3.glb'),
      await modelLoader('/models/channel4.4.glb'),
      await modelLoader('/models/channel4.5.glb'),
      await modelLoader('/models/channel4.6.glb'),
      await modelLoader('/models/channel4.7.glb'),
      await modelLoader('/models/channel4.8.glb'),
    ];

    setLogoPieces(pieces);
    setLogoPiecePositions(pieces.map((piece) => piece.position.y));
    setPiecesReady(true);
  }, []);

  const setYPos = useCallback(() => {
    if (!camera || !renderer || !scene || !parentContainer || !logoPieces) {
      return;
    }

    const offset = parentContainer.getBoundingClientRect().top;

    logoPieces.forEach((logoPiece, index) => {
      logoPiece.position.y = logoPiecePositions[index] - offset / logoPieceSpeeds[index];
    });
  }, [camera, parentContainer, renderer, scene, logoPieces, logoPiecePositions, logoPieceSpeeds]);

  useEffect(() => {
    if (!scene || !renderer || !camera) {
      return;
    }

    if (!piecesReady) {
      loadLogo();
      return;
    }

    if (!piecesAdded) {
      logoPieces.forEach((piece) => scene.add(piece));
      setPiecesAdded(true);
      renderer.render(scene, camera);
    }
  }, [camera, loadLogo, scene, logoPieces, piecesAdded, piecesReady, setYPos, renderer]);

  useEffect(() => {
    if (!renderer || !canvasContainerRef?.current || !scene || !camera) {
      return;
    }
    if (canvasContainerRef.current.hasChildNodes() === false) {
      canvasContainerRef.current.appendChild(renderer.domElement);
      setYPos();
    }
  }, [renderer, canvasContainerRef, camera, scene, setYPos]);

  useEffect(() => {
    if (!parentContainer) {
      return;
    }

    const { offsetWidth, offsetHeight } = parentContainer;
    const width = offsetWidth / 2;
    const height = offsetHeight;
    const zoom = 50 - Math.sqrt(width);
    const _camera = new THREE.PerspectiveCamera(30, 1, 0.1, 2000);

    _camera.rotateX(0.0);
    _camera.rotateZ(-0.0);
    _camera.position.y = 4.5;
    _camera.position.z = zoom;
    _camera.aspect = width / height;
    _camera.updateProjectionMatrix();

    light1.position.setY(10);
    light1.position.setZ(5);
    light2.position.setY(-5);
    light2.position.setZ(5);
    setCamera(_camera);

    const _scene = new THREE.Scene();
    _scene.background = new THREE.Color(0xffffff);
    _scene.add(light1);
    _scene.add(light2);
    setScene(_scene);

    const _renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: false,
    });

    _renderer.setSize(width, height);
    setRenderer(_renderer);
  }, [canvasContainerRef, light1, light2, parentContainer]);

  useEffect(() => {
    const scroll = () => {
      if (!scene || !camera || !renderer) {
        return;
      }
      if (!canvasContainerRef?.current || !isWithinViewport(canvasContainerRef.current)) {
        return;
      }

      setYPos();
      renderer.render(scene, camera);
    };

    const resize = () => {
      if (!scene || !camera || !renderer || !parentContainer || !canvasContainerRef?.current) {
        return;
      }

      renderer.setSize(0, 0);
      canvasContainerRef.current.style.width = '0px';
      canvasContainerRef.current.style.height = '0px';
      requestAnimationFrame(() => {
        if (!canvasContainerRef?.current) {
          return;
        }

        const { offsetWidth, offsetHeight } = parentContainer;
        const width = offsetWidth / 2;
        const height = offsetHeight;
        canvasContainerRef.current.style.width = `${width}px`;
        canvasContainerRef.current.style.height = `${height}px`;
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
  }, [camera, renderer, scene, setYPos, parentContainer]);

  return <div className={classNames.art} ref={canvasContainerRef}></div>;
}
