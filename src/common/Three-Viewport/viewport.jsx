import './viewport.css'

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useEffect, useRef } from 'react';
import { LoadingManager } from 'three';

export const Viewport = ({ onClick, asset, viewportSize }) => {
    const canvasRef = useRef(null)
    const rendererRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene())
    const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000))
    const lightRef = useRef(new THREE.PointLight(0xffffff, 1000))
    const firsModelRef = useRef(null)


    useEffect(() => {
        const canvas = canvasRef.current
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        const controls = new OrbitControls(cameraRef.current, renderer.domElement);
        const ambientLight = new THREE.AmbientLight(0xffffff, 1000)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1000);


        sceneRef.current.add(new THREE.AxesHelper(0.4));
        sceneRef.current.add(lightRef.current);
        sceneRef.current.add(ambientLight);
        directionalLight.position.set(0, 1, 0);
        sceneRef.current.add(directionalLight);

        cameraRef.current.position.set(20, 20, 50);
        lightRef.current.position.set(0, 0, 75);
        controls.update();

        const defaultSize = { width: window.innerWidth / 4, height: window.innerHeight / 4 };
        const size = viewportSize || defaultSize;
        renderer.setSize(size.width, size.height);
        renderer.setClearColor(0x404040);
        renderer.domElement.classList.add('viewport');
        rendererRef.current = renderer;

        const onWindowResize = () => {
            cameraRef.current.aspect = size;
            cameraRef.current.updateProjectionMatrix();
            renderer.setSize(size);
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
        if (!asset) {
            console.log("No asset provided, skipping load.");
            return;
        }

        const manager = new LoadingManager()

        manager.onStart = () => console.log('Loading Started');
        manager.onLoad = () => console.log('Loading complete');
        manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            console.log(`Loading file: ${url} (${itemsLoaded} of ${itemsTotal} files)`);
        }
        manager.onError = (url) => {
            console.error(`There was an error loading: ${url}`);
        }

        const loader = new FBXLoader(manager);
        loader.load(asset, (object) => {
            console.log("Model loaded, checking if a model is already present...");

            if (firsModelRef.current) {
                console.log("Model already loaded, ignoring new model");
                return;
            }

            console.log("No existing model found, adding new model to the scene.");
            sceneRef.current.add(object);
            firsModelRef.current = object

            const bbox = new THREE.Box3().setFromObject(object);
            const objectSize = new THREE.Vector3();
            bbox.getSize(objectSize);

            const maxObjectSize = Math.max(objectSize.x, objectSize.y, objectSize.z)
            const cameraDistance = maxObjectSize*0.3

            cameraRef.current.position.set(20, 20, cameraDistance)
            lightRef.current.position.set(20, 50, cameraDistance)

            const objectCenter = bbox.getCenter(new THREE.Vector3());
            cameraRef.current.lookAt(objectCenter);

            rendererRef.current.render(sceneRef.current, cameraRef.current);

        }, undefined, (error) => {
            console.error('Error loading the asset', error);
        });
    }, [asset]);



    return <canvas onClick={onClick} ref={canvasRef} />;
};