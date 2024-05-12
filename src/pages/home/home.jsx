// Styles

// Lucide
import { MessageSquare, Heart, HeartOff, SquareLibrary, X, Download, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

// Methods/Modules
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import path from "path";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { userData } from "../../app/slices/userSlice";
import { detailData, addUser, removeUser } from "../../app/slices/detailSlice";

// Api Calls
import { createUploadCommentService, getAllUploadsService, getAvatarService, getUploadFileService, likeDislikeService } from '../../services/apiCalls';

// Custom Elements
import { Viewport } from "../../common/Three-Viewport/viewport";
import { CCard } from "../../common/C-card/cCard";
import { CText } from "../../common/C-text/cText";
import { CButton } from "../../common/C-button/cButton";
import { CInput } from "../../common/C-input/cInput";





export const Home = () => {

    /////////////////////////////////////////////////////////////////////// INSTANCES
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const rdxUser = useSelector(userData)
    const rdxDetail = useSelector(detailData)
    const userToken = rdxUser.credentials.userToken
    const userSelected = rdxDetail?.userId

    /////////////////////////////////////////////////////////////////////// HOOKS
    const [uploads, setUploads] = useState(null)
    const [userAvatar, setUserAvatar] = useState(null)
    const [uploadsConverted, setUploadsConverted] = useState(null)
    const [loading, setLoading] = useState(true)
    const [asset, setAset] = useState('../../models/Brick.fbx')
    const [toggleViewport, setToggleViewport] = useState(false)
    const [selectedCard, setSelectedCard] = useState(null)
    const [toggleComments, setToggleComments] = useState(false)
    const [commentData, setCommentData] = useState({ message: "" })
    const [page, setPage] = useState(1)
    const [errorMsg, setErrorMsg] = useState("")
    const [title]=useState('../../../img/Checkpoint-title.png')

    /////////////////////////////////////////////////////////////////////// USE EFFECTS

    useEffect(() => {
        document.title = "Home"
        dispatch(removeUser({ userId: "" }))
    }, [])

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const fetched = await getAllUploadsService(page);
                if (!fetched.success) {
                    throw new Error(fetched?.message);
                }
                setUploads(fetched.data);
            } catch (error) {
                if (error?.message === "TOKEN NOT FOUND" || error?.message === "TOKEN INVALID" || error?.message === "TOKEN ERROR") {
                    dispatch(logout({ credentials: {} }))
                    navigate('/')
                } else {
                    console.log(error);
                }
            }
        };

        if (!uploads) {
            fetchUploads();
        }
    }, [uploads]);

    useEffect(() => {
        const fetchAvatars = async () => {
            const avatars = [];
            if (uploads && uploads?.length > userAvatar?.length || uploads && !userAvatar) {
                for (const upload of uploads) {
                    try {
                        const avatar = await getAvatarService(upload?.user?.avatar)
                        if (avatar.message === 'Network response was not ok:') {
                            console.log('Error loading avatar');
                        }
                        avatars.push(avatar)
                    } catch (error) {
                        if (error?.message === "TOKEN NOT FOUND" || error?.message === "TOKEN INVALID" || error?.message === "TOKEN ERROR") {
                            dispatch(logout({ credentials: {} }))
                            navigate('/')
                        } else {
                            console.log(error);
                        }
                    }
                }
            }
            setUserAvatar(avatars)
        }

        if (uploads?.length !== userAvatar?.length && !userAvatar) {
            fetchAvatars();
        }

    }, [uploads, userAvatar, page])

    useEffect(() => {
        const convertUploads = async () => {
            if (uploads && uploads?.length > uploadsConverted?.length || uploads && !uploadsConverted) {
                const uploadUrls = []
                for (const upload of uploads) {
                    try {
                        const fetchedFile = await getUploadFileService(upload.id)
                        const uploadUrl = URL.createObjectURL(fetchedFile)
                        uploadUrls.push(uploadUrl);
                    } catch (error) {
                        if (error?.message === "TOKEN NOT FOUND" || error?.message === "TOKEN INVALID" || error?.message === "TOKEN ERROR") {
                            dispatch(logout({ credentials: {} }))
                            navigate('/')
                        } else {
                            console.log(error);
                        }
                        uploadUrls.push(null)
                    }
                }
                const validUrls = uploadUrls.filter(url => url !== null)
                setUploadsConverted(validUrls);
                setLoading(false)
            }
        }
        convertUploads();
    }, [uploads, uploadsConverted, page])

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const fetched = await getAllUploadsService(page);
                if (!fetched.success) {
                    setErrorMsg(fetched?.message)
                    setTimeout(() => {
                        setErrorMsg("")
                    }, 2000);
                    throw new Error(fetched?.message);
                }
                setUploads(null)
                setUserAvatar(null)
                setUploadsConverted(null)
                setUploads(fetched.data);
            } catch (error) {
                if (error?.message === "TOKEN NOT FOUND" || error?.message === "TOKEN INVALID" || error?.message === "TOKEN ERROR") {
                    dispatch(logout({ credentials: {} }))
                    navigate('/')
                } else {
                    console.log(error);
                }
            }
        };
        fetchUploads()
    }, [page]);

    /////////////////////////////////////////////////////////////////////// LOGIC

    // hide cards
    const hideCard = (e) => {
        e.target.classList[0] === "viewportDetail"
            ? (setToggleViewport(false),
                setSelectedCard(null))
            : null
    }
    // toggle viewport detail
    const toggleDetail = (index) => {
        setSelectedCard(index)
        setToggleViewport(prevState => !prevState)
    }
    // togge comments
    const showOnlyComments = () => {
        userToken
            ? setToggleComments(prevState => !prevState)
            : null
    }
    // Create comment
    const inputHandler = (e) => {
        setCommentData((prevState) => ({
            message: e.target.value
        }))
    }
    const createCommentInput = async (index) => {
        try {
            const fetched = await createUploadCommentService(uploads[index]?.id, commentData, userToken)
            setCommentData((prevState) => ({
                message: ""
            }))
            if (!fetched.success) {
                throw new Error(fetched.message)
            }
            const updatedComments = [...uploads]
            uploads[index].updatedComments = fetched.data.updatedComments
            setUploads(updatedComments)
        } catch (error) {
            if (error?.message === "TOKEN NOT FOUND" || error?.message === "TOKEN INVALID" || error?.message === "TOKEN ERROR") {
                dispatch(logout({ credentials: {} }))
                navigate('/')
            } else {
                console.log(error);
            }
        }
    }

    // go to user profile
    const goToUserProfile = (index) => {
        dispatch(addUser({
            userId: uploads[index].user.id,
            userName: uploads[index].user.name
        }))
        navigate('/profile')
    }

    // show loading
    if (loading) {
        return (
            <div>cargando...</div>
        )
    }

    // like/dislike
    const likeDislikeInput = async (index) => {
        try {
            const fetched = await likeDislikeService(userToken, uploads[index].id)
            if (!fetched.success) {
                throw new Error(fetched.message)
            }
            const updatedUploads = [...uploads]
            updatedUploads[index].liked = fetched.data
            setUploads(updatedUploads)
        } catch (error) {
            if (error?.message === "TOKEN NOT FOUND" || error?.message === "TOKEN INVALID" || error?.message === "TOKEN ERROR") {
                dispatch(logout({ credentials: {} }))
                navigate('/')
            } else {
                console.log(error);
            }
        }
    }

    const upPage = () => {
        errorMsg
            ? null
            : setPage(prevState => prevState + 1)
    }

    const downPage = () => {
        page > 1
            ? setPage(prevState => prevState - 1)
            : null

    }
    /////////////////////////////////////////////////////////////////////// RETURN

    return (
        <div className="home-design">
            <div className="home-title">
                <img src={title} alt="Checkpoint's title" />
            </div>
            <CText className={'errorPage'} title={errorMsg} />
            <div className="page">
                <ArrowLeftCircle className="icons-info" onClick={() => downPage()} title={'page Down'} />
                <div className="page-info">
                    <CText title={page} />
                </div>
                <ArrowRightCircle className="icons-info" onClick={() => upPage()} title={'page Up'} />
            </div>
            <CCard className={'homeUploads-Card'}>
                {uploadsConverted !== null && uploadsConverted.map((file, index) => (
                    selectedCard !== index
                        // ALL UPLOADS
                        ? (
                            <CCard key={`${index}${uploads[index]?.name}`} className={'homeViewport-Card'}>
                                <div className="author">
                                    {
                                        uploads[index]?.user.avatar !== `${uploads[index]?.user.name}-undefined`
                                            ? (
                                                <div className="author-avatar">
                                                    <CText title={uploads[index]?.user.name} />
                                                    <img
                                                        src={userAvatar[index]}
                                                        alt={`${uploads[index]?.user.name}'s avatar`}
                                                        onClick={userToken ? () => goToUserProfile(index) : null}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="noAvatar" style={{ display: 'none' }}>{uploads[index]?.user?.name.split("")[0].toUpperCase()}</div>
                                                </div>
                                            ) : (
                                                <div className="noAvatar">{uploads[index]?.user?.name.split("")[0].toUpperCase()}</div>
                                            )
                                    }
                                    <CText title={uploads[index]?.name.split(".")[0]} />
                                </div>
                                <Viewport onClick={() => toggleDetail(index)} asset={file || asset} />
                                <div className="info">
                                    <div className="icons-info">
                                        <Heart onClick={() => likeDislikeInput(index)} />
                                        <CText className={'text-iconsInfo'} title={uploads[index]?.liked.length} />
                                    </div>
                                    <div className="icons-info">
                                        <MessageSquare onClick={() => showComments(index)} />
                                        <CText className={'text-iconsInfo'} title={uploads[index]?.uploadComments.length} />
                                    </div>
                                    <div className="icons-info">
                                        <SquareLibrary />
                                        <CText className={'text-iconsInfo'} title={uploads[index]?.posts.length} />
                                    </div>
                                    <div className="icons-info">
                                        {
                                            uploads[index]?.downloadable
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
                                <CCard key={`${index}${uploads[index].name} copy`} className='homeViewport-Card-detail'>
                                    <div className="closeCard"><X onClick={() => toggleDetail()} className='icon-closeCard' /></div>
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
                                    {
                                        <Viewport viewportSize={{ width: 1000, height: 500 }} asset={file || asset} />
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

                                    // UPLOAD COMMENTS
                                    <div className={userToken ? 'uploadComments-card' : 'hidden'}>
                                        <div className='newComment'>
                                            <CInput
                                                type={'textarea'}
                                                name={'message'}
                                                value={commentData.message || ""}
                                                placeholder={'input new comment'}
                                                onChange={(e) => inputHandler(e)}
                                            />
                                            <CButton onClick={() => createCommentInput(index)} title={'New Comment'} />
                                        </div>
                                        {
                                            uploads[index].uploadComments.map((comment, index) => {
                                                return (
                                                    <CCard key={`${index}-${uploads[index].user.email} comment`} className={'comment-card'}>
                                                        <CText className={index % 2 !== 0 ? 'text-comments-author-inverse' : 'text-comments-author'} title={`${comment.message.split(":")[0]}`} />
                                                        <CText className={index % 2 !== 0 ? 'text-comments-message-inverse' : 'text-comments-message'} title={comment.message.split(":")[1]} />
                                                    </CCard>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        )
                ))}
            </CCard>
        </div >
    );
};