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
import { Viewer } from "../../common/Three-Viewport/try";




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
        uploadLoading: true,
        postLoading: true
    })

    /////////////////////////////////////////////////////////////////////// LOGIC

    // Change document title
    useEffect(() => {
        !rdxUser?.credentials?.userToken
            ? navigate('/')
            : (document.title = `${rdxUser?.credentials?.userTokenData?.userName}'s Profile`)
    }, [])

    // Get Profile
    useEffect(() => {
        const getProfile = async () => {
            try {
                const userFetched = await getOwnProfileService(userToken)
                if (!userFetched.success) {
                    throw new Error(userFetched.message)
                }
                // if(!userFetched.data.isActive){

                // }
                if (userFetched.data.avatar.split(":")[0] !== 'https') {
                    const avatarFetched = await getAvatarService(userFetched.data.avatar.split("-")[1], userToken)
                    // if (!avatarFetched.ok) {
                    //     throw new Error(avatarFetched.error)
                    // }
                    setUserAvatar(avatarFetched)
                }
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
            <div className="user-card">
                {
                    loading.infoLoading
                        ? ('loading')
                        : (
                            <CCard className={'userInfo-Card'}>
                                <div className="profileAvatar">
                                    <img src={userAvatar} alt="" />
                                </div>
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
            <div className="uploads-card">
                {
                    loading.uploadLoading
                        ? ('loading')
                        : (
                            userUploads !== null
                                ? (
                                    <CCard>
                                        {
                                            userUploads.map((upload) => {
                                                <Viewer asset={upload} />
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
            <div className="posts-card">
                {
                    loading.postLoading
                        ? ('loading')
                        : (
                            <CCard>
                                {/* <img src={userInfo.avatar} alt="" /> */}
                                {/* <CText title={userInfo.name} />
                            <CText title={userInfo.bio} />
                            <CText title={userInfo.bio} /> */}
                            </CCard>
                        )
                }
            </div>
        </div>
    )
}