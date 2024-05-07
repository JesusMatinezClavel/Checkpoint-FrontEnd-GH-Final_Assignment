import './viewport.css'

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useEffect, useRef } from 'react';

export const Viewer = ({ key, asset }) => {
    const canvasRef = useRef(null)
    const rendererRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene())
    const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000))
    const lightRef = useRef(new THREE.PointLight(0xffffff, 10000))

    useEffect(() => {
        const canvas = canvasRef.current
        const renderer = new THREE.WebGLRenderer({ canvas });
        const controls = new OrbitControls(cameraRef.current, renderer.domElement);
        const ambientLight = new THREE.AmbientLight();

        sceneRef.current.add(new THREE.AxesHelper(0.4));
        sceneRef.current.add(lightRef.current);
        sceneRef.current.add(ambientLight);

        cameraRef.current.position.set(20, 20, 50);
        lightRef.current.position.set(20, 50, 50);
        controls.update();

        renderer.setSize(window.innerWidth / 4, window.innerHeight / 4);
        renderer.domElement.classList.add('viewport');
        rendererRef.current = renderer;

        // document.getElementsByClassName(`viewport3D`)[0].appendChild(renderer.domElement);

        const onWindowResize = () => {
            cameraRef.current.aspect = window.innerWidth / window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            renderer.setSize(window.innerWidth / 4, window.innerHeight / 4);
        };

        window.addEventListener('resize', onWindowResize, false);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(sceneRef.current, cameraRef.current);
        };
        animate();

        return () => {
            window.removeEventListener('resize', onWindowResize);
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (!asset) return;

        const loader = new FBXLoader();
        loader.load(asset, (object) => {
            sceneRef.current.add(object)

            const bbox = new THREE.Box3().setFromObject(object);
            const objectSize = new THREE.Vector3();
            bbox.getSize(objectSize);

            const maxObjectSize = (objectSize.x, objectSize.y, objectSize.z)
            const cameraDistance = maxObjectSize * 1.5

            cameraRef.current.position.set(20, 20, cameraDistance)
            lightRef.current.position.set(20, 50, cameraDistance)

            const objectCenter = bbox.getCenter(new THREE.Vector3());
            cameraRef.current.lookAt(objectCenter);

            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }, undefined, (error) => {
            console.error('Error loading the asset', error);
        });
    }, [asset]);

    return <canvas ref={canvasRef} />;
};

// export default Viewer