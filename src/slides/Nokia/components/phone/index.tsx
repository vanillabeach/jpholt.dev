import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isWithinViewport } from "../../../../utils";
import classNames from "./styles.module.css";

const loader = new GLTFLoader();

function modelLoader(
  url: string
): Promise<THREE.Group<THREE.Object3DEventMap>> {
  return new Promise((resolve, reject) => {
    loader.load(url, (data) => resolve(data.scene), undefined, reject);
  });
}

export interface PhoneParams {
  parentContainer: HTMLDivElement | null;
}

export default function Phone(params: PhoneParams) {
  const { parentContainer } = params;
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [scene, setScene] = useState<THREE.Scene>();
  const [phone, setPhone] = useState<THREE.Group<THREE.Object3DEventMap>>(
    null!
  );
  const [phoneReady, setPhoneReady] = useState<boolean>(false);
  const [phoneAdded, setPhoneAdded] = useState<boolean>(false);
  const light1 = useMemo(() => new THREE.SpotLight(0x0d58d3, 1000), []);
  const light2 = useMemo(() => new THREE.SpotLight(0xff00ff, 1000), []);

  const loadPhone = useCallback(async () => {
    setPhone(await modelLoader("/models/phone.glb"));
    setPhoneReady(true);
  }, []);

  const setYPos = useCallback(() => {
    if (!camera || !renderer || !scene || !parentContainer || !phone) {
      return;
    }

    const offset = parentContainer.getBoundingClientRect().top;

    phone.position.y = 0 - offset / 5;
    phone.rotation.x = Math.PI / 2 + offset / 250;
    phone.rotation.y = offset / -200;
  }, [camera, parentContainer, renderer, scene, phone]);

  useEffect(() => {
    if (!scene || !renderer || !camera) {
      return;
    }

    if (!phoneReady) {
      loadPhone();
      return;
    }

    if (!phoneAdded) {
      phone.rotateX(1.7);
      scene.add(phone);
      setPhoneAdded(true);
      renderer.render(scene, camera);
    }
  }, [
    camera,
    loadPhone,
    phone,
    phoneAdded,
    phoneReady,
    scene,
    setYPos,
    renderer,
  ]);

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
    const width = offsetWidth;
    const height = offsetHeight;
    const zoom = 400 - Math.sqrt(width);
    const _camera = new THREE.PerspectiveCamera(30, 1, 0.1, 2000);

    _camera.rotateX(0.0);
    _camera.rotateZ(0);
    _camera.position.x = 20;
    _camera.position.y = 0;
    _camera.position.z = zoom;
    _camera.aspect = width / height;
    _camera.updateProjectionMatrix();

    light2.position.setX(40);
    light2.position.setY(18);
    light2.position.setZ(25);
    light1.position.setX(40);
    light1.position.setY(18);
    light1.position.setZ(60);
    light2.angle = Math.PI;
    setCamera(_camera);

    const _scene = new THREE.Scene();
    //_scene.add(light0);
    _scene.add(light1);
    _scene.add(light2);
    setScene(_scene);

    const _renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });

    _renderer.setSize(width, height);
    setRenderer(_renderer);
  }, [canvasContainerRef, light1, light2, parentContainer]);

  useEffect(() => {
    const scroll = () => {
      if (!scene || !camera || !renderer) {
        return;
      }
      if (
        !canvasContainerRef?.current ||
        !isWithinViewport(canvasContainerRef.current)
      ) {
        return;
      }

      setYPos();
      renderer.render(scene, camera);
    };

    const resize = () => {
      if (
        !scene ||
        !camera ||
        !renderer ||
        !parentContainer ||
        !canvasContainerRef?.current
      ) {
        return;
      }

      const canvasContainer = canvasContainerRef.current;

      renderer.setSize(0, 0);
      canvasContainer.style.width = "0px";
      canvasContainer.style.height = "0px";
      requestAnimationFrame(() => {
        const { offsetWidth, offsetHeight } = parentContainer;
        const width = offsetWidth;
        const height = offsetHeight;
        canvasContainer.style.width = `${width}px`;
        canvasContainer.style.height = `${height}px`;
        camera.aspect = width / height;
        renderer.setSize(width, height);
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      });
    };

    window.addEventListener("scroll", scroll);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
    };
  }, [camera, renderer, scene, setYPos, parentContainer]);

  return <div className={classNames.art} ref={canvasContainerRef}></div>;
}
