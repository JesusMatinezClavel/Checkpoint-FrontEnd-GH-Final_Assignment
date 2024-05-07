import { useState, useEffect } from "react";
import { Viewer } from "../../common/Three-Viewport/try";
import { CCard } from "../../common/C-card/cCard";
import { CText } from "../../common/C-text/cText";
import { CButton } from "../../common/C-button/cButton";
import { getAllUploadsService, getUploadFileService } from '../../services/apiCalls';
import { login } from "../../app/slices/userSlice";

export const Home = () => {
    const [uploads, setUploads] = useState(null);
    // const [selectedAsset, setSelectedAsset] = useState(null);
    // const [openDetail, setOpenDetail] = useState(false)
    const [uploadsConverted, setUploadsConverted] = useState(null)
    const [loading, setLoading] = useState(true)
    const [asset, setAset] = useState('../../models/Brick.fbx')

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const fetched = await getAllUploadsService();
                if (!fetched.success) {
                    throw new Error(fetched.message);
                }
                setUploads(fetched.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (!uploads) {
            fetchUploads();
        }
    }, [uploads]);

    // useEffect(() => {
    //     if (uploadsConverted === null) {
    //         try {
    //             if (uploads !== null) {
    //                 const files = []
    //                 let loadedCount = 0
    //                 for (const upload of uploads) {
    //                     const getUploadFile = async () => {
    //                         try {
    //                             const fetchedFile = await getUploadFileService(upload.id)
    //                             const uploadUrl = URL.createObjectURL(fetchedFile)
    //                             files.push(uploadUrl)
    //                             loadedCount++
    //                             if (loadedCount === uploads.length) {
    //                                 setUploadsConverted(files)
    //                                 setLoading(false)
    //                             }
    //                         } catch (error) {
    //                             console.log(error);
    //                         }
    //                     }
    //                     getUploadFile()
    //                 }
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // }, [uploadsConverted])

    useEffect(() => {
        if (uploads && !uploadsConverted) {
            Promise.all(uploads.map(async (upload) => {
                try {
                    const fetchedFile = await getUploadFileService(upload.id);
                    const uploadUrl = URL.createObjectURL(fetchedFile);
                    return uploadUrl;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            })).then((urls) => {
                const validUrls = urls.filter(url => url !== null);
                setUploadsConverted(validUrls);
                setLoading(false);
            });
        }
    }, [uploads, uploadsConverted]);

    // const viewDetail = (asset) => {
    //     openDetail
    //         ? setOpenDetail(false)
    //         : setOpenDetail(true)
    //     // setSelectedAsset(asset);
    // };

    if (loading) {
        return (
            <div>cargando...</div>
        )
    }
    // console.log(uploadsConverted);
    return (
        <div className="home-design">
            <CCard className={'homeUploads-Card'}>
                {uploadsConverted !== null && uploadsConverted.slice(0, 3).map((file, index) => (
                    <CCard key={`${index}${uploads[index].name}`} className={'homeViewport-Card'}>
                        <div className="homeViewport-info">
                            <CText title={uploads[index].name} />
                        </div>
                        <Viewer asset={file} />
                    </CCard>
                ))}
            </CCard>
        </div>
    );
};




