import './viewport.css'

// THREE
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import stats from "three/examples/jsm/libs/stats.module.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import { useEffect } from 'react';


export const Viewport = ({ asset }) => {

    // INSTANCES
    const loader = new FBXLoader();
    const defaultAsset = asset || `../../../models/Brick.fbx`

    if (!WebGL.isWebGLAvailable()) {
        const warning = WebGL.getWebGLErrorMessage();
        document.getElementById('container').appendChild(warning);
        return;
    }

    const scene3D = new THREE.Scene();
    const camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera3D, renderer.domElement);
    const light = new THREE.PointLight(0xffffff, 10000);
    const ambientLight = new THREE.AmbientLight();

    useEffect(() => {
        scene3D.add(new THREE.AxesHelper(0.4));
        scene3D.add(light);
        scene3D.add(ambientLight);

        renderer.setSize(window.innerWidth / 4, window.innerHeight / 4);
        renderer.domElement.classList.add('viewport');
        // setTimeout(() => {
            document.getElementsByClassName(`viewport3D`)[0].appendChild(renderer.domElement);
        // }, 200);

        const onWindowResize = () => {
            camera3D.aspect = window.innerWidth / window.innerHeight;
            camera3D.updateProjectionMatrix();
            renderer.setSize(window.innerWidth / 4, window.innerHeight / 4);
        };
        window.addEventListener('resize', onWindowResize, false);

        loader.load(defaultAsset,
            (object) => {
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material
                        if (child.material) {
                            child.material.transparent = false
                        }
                    }
                })
                scene3D.add(object)
                // setUploadPreviews((prevState) => ({
                //     ...prevState,
                //     object
                // }))

                const bbox = new THREE.Box3().setFromObject(object);
                const objectSize = new THREE.Vector3();
                bbox.getSize(objectSize);

                const maxObjectSize = (objectSize.x, objectSize.y, objectSize.z)
                const cameraDistance = maxObjectSize * 1.5

                camera3D.position.set(20, 20, cameraDistance)
                light.position.set(20, 50, cameraDistance)

                const objectCenter = bbox.getCenter(new THREE.Vector3());
                camera3D.lookAt(objectCenter);

            }, undefined, (error) => {
                console.log('Error loading the asset', error);
            })

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene3D, camera3D);
        };
        animate();

        return () => {
            window.removeEventListener('resize', onWindowResize);
            renderer.dispose();
            // document.getElementsByClassName(`home-design`)[0].appendChild(<div className={`viewport3D`}></div>);
        };
    }, [asset])

    return <div className={`viewport3D`}></div>
}
