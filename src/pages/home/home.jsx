import './home.css'

import { useState, useEffect } from "react";

// THREE
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import stats from "three/examples/jsm/libs/stats.module.js";
import WebGL from "three/addons/capabilities/WebGL.js";

import { getAllUploadsService } from '../../services/apiCalls';


export const Home = () => {

    // INSTANCES
    const loader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();
    const reader = new FileReader()

    // 3D
    const renderer3D = new THREE.WebGLRenderer()
    const scene3D = new THREE.Scene()
    const camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
    const geometry3D = new THREE.BoxGeometry(1, 1, 1)
    const material3D = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const light = new THREE.PointLight(0xffffff, 10000)
    const ambientLight = new THREE.AmbientLight()
    const controls = new OrbitControls(camera3D, renderer3D.domElement)

    const [uploads, setUploads] = useState(null)
    const [uploadsConverted, setUploadsConverted] = useState(null)
    const [asset, setAsset] = useState('../../models/cube.fbx')


    useEffect(() => {
        const getUploads = async () => {
            try {
                const fetched = await getAllUploadsService()
                if (!fetched.success) {
                    throw new Error(fetched.message)
                }
                setUploads(fetched.data)
            } catch (error) {
                if (error === "TOKEN NOT FOUND" || error === "TOKEN INVALID" || error === "TOKEN ERROR") {
                    dispatch(logout({ credentials: {} }));
                } else {
                    console.log(error);
                }
            }
        }

        if (uploads === null) {
            getUploads()
        }
    }, [uploads])

    useEffect(() => {
        if (uploads !== null) {
            const files = []
            uploads.map(upload => {
                const blob = new Blob([upload.file.data], { type: 'application/octet-binary' });
                console.log(blob.size);
                const blobUrl = URL.createObjectURL(blob)
                files.push(blobUrl)
            })
            setUploadsConverted(files)
        }
    }, [uploads])


    useEffect(() => {
        if (uploads) {
            console.log(uploadsConverted[0]);
            if (!WebGL.isWebGLAvailable()) {
                const warning = WebGL.getWebGLErrorMessage();
                document.getElementById('container').appendChild(warning);
                return;
            }
            const existingViewport = document.querySelector('.viewport3D canvas');
            if (existingViewport) {
                existingViewport.parentElement.removeChild(existingViewport);
            }
            scene3D.add(new THREE.AxesHelper(.4))
            scene3D.add(light)
            scene3D.add(ambientLight)

            renderer3D.setSize(window.innerWidth / 4, window.innerHeight / 4)
            renderer3D.domElement.classList.add('viewport')
            document.getElementsByClassName('viewport3D')[0].appendChild(renderer3D.domElement)

            window.addEventListener('resize', onWindowResize, false)
            function onWindowResize() {
                camera3D.aspect = window.innerWidth / window.innerHeight
                camera3D.updateProjectionMatrix()
                renderer3D.setSize(window.innerWidth / 4, window.innerHeight / 4)
                render()
            }

            const render = () => {
                renderer3D.render(scene3D, camera3D)
            }

            controls.enableDamping = true
            controls.target.set(0, 0, 0)

            loader.load((uploadsConverted[0]),
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
                },
                // (xhr) => {
                //     parseInt(xhr.loaded / xhr.total) === 1
                //         ? setLoading(true)
                //         : setLoading(false)
                // },
                (error) => {
                    console.log(error)
                }
            )

            const animate = () => {
                requestAnimationFrame(animate);

                controls.update()

                render()

            }

            animate();
            return () => {
                window.removeEventListener('resize', onWindowResize);
            };
        }
    }, [uploadsConverted])


    return (
        <div className="home-design">
            <div className='viewport3D'></div>
            <>
                {/* {uploads !== null ? <a href={uploadsConverted[0]} download="nombre_del_archivo.fbx">Descargar Modelo 3D</a> : null} */}
                {/* <a href={uploadsConverted[0]} download="nombre_del_archivo.fbx">Descargar Modelo 3D</a> */}
            </>
        </div>
    )
}