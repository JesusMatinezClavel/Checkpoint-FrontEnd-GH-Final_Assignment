import { useState, useEffect } from "react";
import { Viewer } from "../../common/Three-Viewport/try";
import { CCard } from "../../common/C-card/cCard";
import { CText } from "../../common/C-text/cText";
import { CButton } from "../../common/C-button/cButton";
import { getAllUploadsService, getUploadFileService } from '../../services/apiCalls';
import { login } from "../../app/slices/userSlice";

import { MessageSquare, Heart, SquareLibrary } from "lucide-react";

export const Home = () => {
    const [uploads, setUploads] = useState(null);
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

    if (loading) {
        return (
            <div>cargando...</div>
        )
    }

    console.log(uploads);

    return (
        <div className="home-design">
            <CCard className={'homeUploads-Card'}>
                {uploadsConverted !== null && uploadsConverted.slice(0, 9).map((file, index) => (
                    <CCard key={`${index}${uploads[index].name}`} className={'homeViewport-Card'}>
                        <CText title={uploads[index].name} />
                        <Viewer asset={file} />
                        <div className="info">
                            <div className="icons-info">
                                <Heart />
                                <CText className={'text-iconsInfo'} title={uploads[index].liked.length} />
                            </div>
                            <div className="icons-info">
                                <MessageSquare />
                                <CText className={'text-iconsInfo'} title={uploads[index].uploadComments.length} />
                            </div>
                            <div className="icons-info">
                                <SquareLibrary />
                                <CText className={'text-iconsInfo'} title={uploads[index].posts.length} />
                            </div>
                        </div>
                    </CCard>
                ))}
            </CCard>
        </div>
    );
};