// Styles
import './profile.css'

// Lucide

// Methods/Modules
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { userData, logout } from "../../app/slices/userSlice";

// Api Calls
import { getAvatarService, getOwnProfileService, getUploadFileService } from '../../services/apiCalls';

// Custom Methods

// Custom Elements
import { CCard } from "../../common/C-card/cCard"
import { CText } from "../../common/C-text/cText";
import { Viewport } from "../../common/Three-Viewport/viewport";




export const Profile = () => {
    /////////////////////////////////////////////////////////////////////// INSTANCES
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const rdxUser = useSelector(userData)
    const userToken = rdxUser.credentials.userToken

    /////////////////////////////////////////////////////////////////////// HOOKS
    const [userInfo, setUserInfo] = useState(null)
    const [userUploads, setUserUploads] = useState(null)
    const [userAvatar, setUserAvatar] = useState(null)
    const [loading, setLoading] = useState({
        infoLoading: true,
        uploadLoading: true
    })

    /////////////////////////////////////////////////////////////////////// LOGIC

    // Change document title
    useEffect(() => {
        !rdxUser?.credentials?.userToken
            ? navigate('/')
            : (document.title = `${rdxUser?.credentials?.userTokenData?.userName}'s Profile`)
    }, [])

    console.log(userInfo);

    // Get Profile
    useEffect(() => {
        const getProfile = async () => {
            try {
                const userFetched = await getOwnProfileService(userToken)
                if (!userFetched.success) {
                    throw new Error(userFetched.message)
                }
                const avatarFetched = await getAvatarService(userFetched.data.avatar.split("-")[1], userToken)
                // if (!avatarFetched.ok) {
                //     throw new Error(avatarFetched.error)
                // }
                setUserAvatar(avatarFetched)
                setUserInfo(userFetched.data)
                setLoading((prevState) => ({
                    ...prevState,
                    infoLoading: false
                }));
            } catch (error) {
                if (error === "TOKEN NOT FOUND" || error === "TOKEN INVALID" || error === "TOKEN ERROR") {
                    dispatch(logout({ credentials: {} }));
                } else {
                    console.log(error);
                }
            }
        }
        if (userInfo === null) {
            getProfile()
        }
    }, [userInfo])

    useEffect(() => {
        if (userInfo && userInfo.uploads.lenght !== 0 && !userUploads) {
            Promise.all(userInfo.uploads.map(async (upload) => {
                try {
                    const fetchedFile = await getUploadFileService(upload.id);
                    console.log("vamos: ",fetchedFile);
                    const uploadUrl = URL.createObjectURL(fetchedFile);
                    return uploadUrl;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            })).then((urls) => {
                const validUrls = urls.filter(url => url !== null);
                setUserUploads(validUrls);
                setLoading((prevState) => ({
                    ...prevState,
                    uploadLoading: false
                }));
            });
        }
    }, [userInfo, userUploads])

    /////////////////////////////////////////////////////////////////////// RETURN

    return (
        <div className="profile-design">
            <div className="uploads-card">
                {
                    loading.uploadLoading
                        ? ('loading')
                        : (
                            userUploads !== null
                                ? (
                                    <CCard className={'userUploads-card'}>
                                        {
                                            userUploads.map((upload, index) => {
                                                return (
                                                    <Viewport key={`${index}-${userInfo.name}`} asset={upload} />
                                                )
                                            })
                                        }
                                    </CCard>
                                )
                                : (
                                    <CCard title={'You have no models uploaded!'} />
                                )
                        )
                }
            </div>
            <div className="user-card">
                {
                    loading.infoLoading
                        ? ('loading')
                        : (
                            <CCard className={'userInfo-Card'}>
                                {
                                    userInfo.avatar !== `${userInfo.name}-undefined`
                                        ? (
                                            <div className="author-avatar">
                                                <img
                                                    src={userAvatar}
                                                    alt={`${userInfo.name}'s avatar`}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div className="noAvatar" style={{ display: 'none' }}>{userInfo.name.split("")[0].toUpperCase()}</div>
                                            </div>
                                        ) : (
                                            <div className="noAvatar Profile">{userInfo.name.split("")[0].toUpperCase()}</div>
                                        )
                                }
                                <CText className={'text-infoTitle'} title={'name'} />
                                <CText className={'text-userInfo'} title={userInfo.name} />
                                <CText className={'text-infoTitle'} title={'biography'} />
                                <CText className={'text-userInfo'} title={userInfo.bio} />
                                <CText className={'text-infoTitle'} title={'email'} />
                                <CText className={'text-userInfo'} title={userInfo.email} />
                            </CCard>
                        )
                }
            </div>
        </div>
    )
}