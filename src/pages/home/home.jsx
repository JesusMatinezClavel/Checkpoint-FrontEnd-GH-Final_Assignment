// Styles

// Lucide
import { MessageSquare, Heart, SquareLibrary, X, Download } from "lucide-react";

// Methods/Modules
import { useState, useEffect } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { userData } from "../../app/slices/userSlice";

// Api Calls
import { getAllUploadsService, getAvatarService, getUploadFileService } from '../../services/apiCalls';

// Custom Elements
import { Viewport } from "../../common/Three-Viewport/viewport";
import { CCard } from "../../common/C-card/cCard";
import { CText } from "../../common/C-text/cText";
import { CButton } from "../../common/C-button/cButton";
import { CInput } from "../../common/C-input/cInput";





export const Home = () => {

    /////////////////////////////////////////////////////////////////////// INSTANCES
    const dispatch = useDispatch()
    const rdxUser = useSelector(userData)
    const userToken = rdxUser.credentials.userToken

    /////////////////////////////////////////////////////////////////////// HOOKS
    const [uploads, setUploads] = useState(null)
    const [userAvatar, setUserAvatar] = useState([])
    const [uploadsConverted, setUploadsConverted] = useState(null)
    const [loading, setLoading] = useState(true)
    const [asset, setAset] = useState('../../models/Brick.fbx')
    const [toggleViewport, setToggleViewport] = useState(false)
    const [selectedCard, setSelectedCard] = useState(null)
    const [toggleComments, setToggleComments] = useState(false)

    /////////////////////////////////////////////////////////////////////// USE EFFECTS

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const fetched = await getAllUploadsService();
                if (!fetched.success) {
                    throw new Error(fetched?.message);
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
        const fetchAvatars = async () => {
            const avatars = [];
            for (const upload of uploads) {
                try {
                    const avatar = await getAvatarService(upload?.user.avatar, userToken)
                    avatars.push(avatar)
                } catch (error) {
                    console.error(error)
                }
            }
            setUserAvatar(prevState => [...prevState, ...avatars])
        }

        if (uploads?.length > 0 && (!userAvatar || userAvatar?.length === 0)) {
            fetchAvatars();
        }

    }, [uploads, userAvatar])

    useEffect(() => {
        const convertUploads = async () => {
            if (uploads && !uploadsConverted) {
                try {
                    const uploadUrls = await Promise.all(uploads.map(async (upload) => {
                        try {
                            const fetchedFile = await getUploadFileService(upload.id);
                            const uploadUrl = URL.createObjectURL(fetchedFile);
                            return uploadUrl;
                        } catch (error) {
                            console.error(error);
                            return null;
                        }
                    }));
                    const validUrls = uploadUrls.filter(url => url !== null);
                    setUploadsConverted(validUrls);
                    setLoading(false);
                } catch (error) {
                    console.error('Error processing uploads:', error);
                }
            }
        }
        convertUploads();
    }, [uploads, uploadsConverted]);

    /////////////////////////////////////////////////////////////////////// LOGIC


    const hideCard = (e) => {
        e.target.classList === "viewportDetail"
            ? (setToggleViewport(false),
                setSelectedCard(null))
            : null
    }

    const toggleDetail = (index) => {
        setSelectedCard(index)
        setToggleViewport(prevState => !prevState)
    }

    const showComments = (index) => {
        setSelectedCard(index)
        setToggleViewport(prevState => !prevState)
        setToggleComments(prevState => !prevState)
    }
    const showOnlyComments = () => {
        setToggleComments(prevState => !prevState)
    }

    if (loading) {
        return (
            <div>cargando...</div>
        )
    }

    /////////////////////////////////////////////////////////////////////// RETURN

    return (
        <div className="home-design">
            <CCard className={'homeUploads-Card'}>
                {uploadsConverted !== null && uploadsConverted.slice(0, 9).map((file, index) => (
                    selectedCard !== index
                        // ALL UPLOADS
                        ? (
                            <CCard key={`${index}${uploads[index].name}`} className={'homeViewport-Card'}>
                                <div className="author">
                                    {
                                        uploads[index].user.avatar !== `${uploads[index].user.name}-undefined`
                                            ? (
                                                <div className="author-avatar">
                                                    <img
                                                        src={userAvatar[index]}
                                                        alt={`${uploads[index].user.name}'s avatar`}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="noAvatar" style={{ display: 'none' }}>{uploads[index].user.name.split("")[0].toUpperCase()}</div>
                                                </div>
                                            ) : (
                                                <div className="noAvatar">{uploads[index].user.name.split("")[0].toUpperCase()}</div>
                                            )
                                    }
                                    <CText title={uploads[index].name.split(".")[0]} />
                                </div>
                                <Viewport onClick={() => toggleDetail(index)} asset={file || asset} />
                                <div className="info">
                                    <div className="icons-info">
                                        <Heart />
                                        <CText className={'text-iconsInfo'} title={uploads[index].liked.length} />
                                    </div>
                                    <div className="icons-info">
                                        <MessageSquare onClick={() => showComments(index)} />
                                        <CText className={'text-iconsInfo'} title={uploads[index].uploadComments.length} />
                                    </div>
                                    <div className="icons-info">
                                        <SquareLibrary />
                                        <CText className={'text-iconsInfo'} title={uploads[index].posts.length} />
                                    </div>
                                    <div className="icons-info">
                                        {
                                            uploads[index].downloadable
                                                ? <a href={file} download><Download /></a>
                                                : <Download />
                                        }
                                    </div>
                                </div>
                            </CCard>
                        )
                        // DETAIL UPLOAD
                        : (
                            <div onClick={(e) => hideCard(e)} className="viewportDetail">
                                <CCard key={`${index}${uploads[index].name} copy`} className='homeViewport-Card'>
                                    <div className="closeCard"><X onClick={() => toggleDetail()} className='icon-closeCard' /></div>
                                    <div className="author">
                                        {
                                            uploads[index].user.avatar !== `${uploads[index].user.name}-undefined`
                                                ? (
                                                    <div className="author-avatar">
                                                        <img
                                                            src={uploads[index].user.avatar}
                                                            alt={`${uploads[index].user.name}'s avatar`}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.style.display = 'none';
                                                                e.target.nextElementSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                        <div className="noAvatar" style={{ display: 'none' }}>{uploads[index].user.name.split("")[0].toUpperCase()}</div>
                                                    </div>
                                                ) : (
                                                    <div className="noAvatar">{uploads[index].user.name.split("")[0].toUpperCase()}</div>
                                                )
                                        }
                                        <CText title={uploads[index].name} />
                                    </div>
                                    {
                                        <Viewport asset={file || asset} />
                                    }
                                    <div className="info">
                                        <div className="icons-info">
                                            <Heart />
                                            <CText className={'text-iconsInfo'} title={uploads[index].liked.length} />
                                        </div>
                                        <div className="icons-info">
                                            <MessageSquare onClick={() => showOnlyComments()} />
                                            <CText className={'text-iconsInfo'} title={uploads[index].uploadComments.length} />
                                        </div>
                                        <div className="icons-info">
                                            <SquareLibrary />
                                            <CText className={'text-iconsInfo'} title={uploads[index].posts.length} />
                                        </div>
                                        <div className="icons-info">
                                            <Download />
                                        </div>
                                    </div>
                                </CCard>
                                {
                                    toggleComments
                                        ? (
                                            <div className="UploadComments-card">
                                                {
                                                    uploads[index].uploadComments.map((comment, index) => {
                                                        return (
                                                            <CCard key={`${index}-${uploads[index].user.name}`} className={'comment-card'}>
                                                                <CText className={'text-comments'} title={comment.message} />
                                                            </CCard>
                                                        )
                                                    })
                                                }
                                                <div className="newComment">
                                                    <CInput
                                                        type={'textarea'}
                                                    />
                                                    <CButton title={'New Comment'} />
                                                </div>
                                            </div>
                                        )
                                        : null
                                }
                            </div>
                        )
                ))}
            </CCard>
        </div >
    );
};