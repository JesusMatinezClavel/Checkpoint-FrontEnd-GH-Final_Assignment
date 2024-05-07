import './home.css'

import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

// THREE
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import stats from "three/examples/jsm/libs/stats.module.js";
import WebGL from "three/addons/capabilities/WebGL.js";

import { getAllUploadsService, getUploadFileService } from '../../services/apiCalls';

import { Viewport } from "../../common/Three-Viewport/viewport";



export const Home = () => {

    // INSTANCES
    const loader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();
    const reader = new FileReader()

    const [uploads, setUploads] = useState(null)
    const [uploadsConverted, setUploadsConverted] = useState(null)
    const [asset, setAsset] = useState('../../models/brick.fbx')
    const [viewport, setViewport] = useState(<Viewport asset={asset} />)

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
        if (uploadsConverted === null) {
            try {
                if (uploads !== null) {
                    const files = []
                    for (const upload of uploads) {
                        const getUploadFile = async () => {
                            try {
                                const fetchedFile = await getUploadFileService(upload.id)
                                const uploadUrl = URL.createObjectURL(fetchedFile)
                                files.push(uploadUrl)
                                setUploadsConverted(files)
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        getUploadFile()
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [uploadsConverted])

    // useEffect(() => {
    //     const viewportContainer = document.createElement('div');

    //     const root = createRoot(viewportContainer);

    //     if (uploadsConverted !== null) {
    //         uploadsConverted.map(file => {
    //             root.render(<Viewport asset={file} />)
    //             const homeDesignContainer = document.querySelector('.home-design');

    //             if (homeDesignContainer) {
    //                 homeDesignContainer.appendChild(viewportContainer);
    //             }

    //             return () => {
    //                 root.unmount();
    //             };
    //         })
    //     }

    // }, [uploadsConverted]);


    return (
        <div className="home-design">
            <Viewport asset={asset} />
            {/* {
                uploadsConverted && uploads && uploadsConverted.length === uploads.length ? (uploadsConverted.map((file, index) => (< Viewport key={index} asset={file} />))) : null
            } */}
            {uploadsConverted && uploads && uploadsConverted.length === uploads.length && uploadsConverted.map((file, index) => (
                <Viewport key={index} asset={file} />
            ))}
            {/* <div className='viewport3D'></div> */}
        </div>
    );
}