// Styles
import './profile.css'

// Lucide
import { MessageSquare, Heart, SquareLibrary, X, Check, UserCheck, UserRoundCheck } from "lucide-react";

// Methods/Modules
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { userData, logout } from "../../app/slices/userSlice";
import { detailData, addUser, removeUser, addUpload, removeUpload } from "../../app/slices/detailSlice";

// Api Calls
import { deleteOwnProfileService, deleteOwnUploadService, followUnfollowService, getAvatarService, getOwnProfileService, getOwnUploadsService, getProfileByIdService, getUploadFileService, updateOwnProfileService, uploadAvatarService } from '../../services/apiCalls';

// Custom Methods
import { validate } from "../../utils/validator";

// Custom Elements
import { CCard } from "../../common/C-card/cCard"
import { CText } from "../../common/C-text/cText";
import { CButton } from "../../common/C-button/cButton";
import { CInput } from "../../common/C-input/cInput";
import { Viewport } from "../../common/Three-Viewport/viewport";




export const Profile = () => {
    /////////////////////////////////////////////////////////////////////// INSTANCES
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const rdxUser = useSelector(userData)
    const rdxDetail = useSelector(detailData)
    const userToken = rdxUser?.credentials?.userToken
    const userSelected = rdxDetail?.userId
    const fileUploaded = rdxDetail?.uploadFile
    const reader = new FileReader()
    let file
    let newFile
    let newFileName

    /////////////////////////////////////////////////////////////////////// HOOKS
    const [userInfo, setUserInfo] = useState(null)
    const [userUploads, setUserUploads] = useState(null)
    const [uploadFiles, setUploadFiles] = useState(null)
    const [userAvatar, setUserAvatar] = useState(null)
    const [newUpload, setNewUpload] = useState(null)
    const [loading, setLoading] = useState({
        infoLoading: true,
        uploadLoading: true
    })
    const [updateData, setUpdateData] = useState({
        name: "",
        bio: "",
        avatar: "",
        email: "",
        password: ""
    })
    const [updateDataError, setUpdateDataError] = useState({
        nameError: "",
        bioError: "",
        avatarError: "",
        emailError: "",
        passwordError: ""
    })
    const [updateAvatar, setUpdateAvatar] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [showUpdate, setShowUpdate] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showDeleteUpload, setShowDeleteUpload] = useState(false)

    /////////////////////////////////////////////////////////////////////// USE EFFECTS

    // Change document title
    useEffect(() => {
        userSelected
            ? document.title = `${rdxDetail?.userName}'s profile`
            : document.title = `${rdxUser?.credentials?.userTokenData?.userName}'s profile`
    }, [])

    useEffect(() => {
        if (fileUploaded) {
            setNewUpload(fileUploaded)
            console.log('new upload NOOOOOO ES NULL', newUpload);
        } else {
            setNewUpload(null)
            console.log('new upload SIIIIIII ES NULL', newUpload);
        }
    }, [fileUploaded])

    // Get Profile
    useEffect(() => {
        const getProfile = async () => {
            let userFetched
            try {
                if (!userSelected) {
                    userFetched = await getOwnProfileService(userToken)
                } else {
                    userFetched = await getProfileByIdService(userToken, userSelected)
                }
                if (!userFetched?.success) {
                    throw new Error(userFetched?.message)
                }
                const avatarFetched = await getAvatarService(userFetched?.data?.avatar)
                setUserAvatar(avatarFetched)
                setUserInfo(userFetched?.data)
                setLoading((prevState) => ({
                    ...prevState,
                    infoLoading: false
                }));
            } catch (error) {
                if (error.message === "TOKEN NOT FOUND" || error.message === "TOKEN INVALID" || error.message === "TOKEN ERROR") {
                    dispatch(logout({ credentials: {} }));
                } else {
                    console.log(error);
                }
            }
        }
        if (userInfo === null || userInfo?.uploads?.length !== userUploads?.length) {
            getProfile()
        }
    }, [userInfo,])

    useEffect(() => {
        if (fileUploaded) {
            const loadModel = async () => {
                try {
                    const fileUrl = await getUploadFileService(fileUploaded.id);
                    const newModelUrl = URL.createObjectURL(fileUrl);
                    setUploadFiles(prevFiles => [...prevFiles, newModelUrl]);
                    dispatch(removeUpload({ uploadFile: {} }))
                } catch (error) {
                    console.error('Error al cargar el modelo:', error);
                }
            };

            loadModel();
        }
    }, [fileUploaded]);

    // Get Avatar
    useEffect(() => {
        const getAvatar = async () => {
            try {
                const avatarFetched = await getAvatarService(userInfo?.avatar, userToken)
                setUserAvatar(avatarFetched)
            } catch (error) {
                console.log(error);
            }
        }
        if (userInfo?.avatar) {
            getAvatar()
        }
    }, [userInfo])

    // Get User's Uploads
    useEffect(() => {
        if (userInfo && !userUploads || userInfo?.uploads.lenght !== userUploads?.lenght) {
            const getUserUploads = async () => {
                try {
                    const uploadsFetched = await getOwnUploadsService(userToken)
                    if (!uploadsFetched) {
                        throw new Error(uploadsFetched.message)
                    }
                    setUserUploads(uploadsFetched.data)
                } catch (error) {
                    if (error.message === "TOKEN NOT FOUND" || error.message === "TOKEN INVALID" || error.message === "TOKEN ERROR") {
                        dispatch(logout({ credentials: {} }));
                    } else {
                        console.log(error);
                    }
                }
            }
            getUserUploads()
        }
    }, [userInfo, userUploads])

    // Get Files from uploads
    useEffect(() => {
        if (userInfo?.uploads.lenght === userUploads?.lenght && !uploadFiles) {
            const getUploadFiles = async () => {
                const uploadsUrl = []
                try {
                    userUploads.map(async (upload) => {
                        const fileFetched = await getUploadFileService(upload.id)
                        const fileUrl = URL.createObjectURL(fileFetched)
                        uploadsUrl.push(fileUrl)
                    })
                    setUploadFiles(uploadsUrl)
                    setLoading((prevState) => ({
                        ...prevState,
                        uploadLoading: false
                    }))
                } catch (error) {
                    console.log(error);
                }
            }
            getUploadFiles()
        }

    }, [userUploads, uploadFiles])

    // Link errors with errorsMsg
    useEffect(() => {
        let allErrorsCleared

        for (let element in updateDataError) {
            if (updateDataError[element] !== "") {
                setErrorMsg(updateDataError[element])
                break
            }
        }
        allErrorsCleared = Object.values(updateDataError).every(value => value === "")

        allErrorsCleared ? setErrorMsg("") : null
    }, [updateDataError])


    /////////////////////////////////////////////////////////////////////// LOGIC 

    // Input Handler
    const inputHandler = (e) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file) {
                const newFileName = `${userInfo?.name}-${file.name}`;
                const newFile = new File([file], newFileName, { type: file.type });
                setUpdateAvatar(newFile);
                const reader = new FileReader();
                reader.onload = (event) => {
                    setUserAvatar(event.target.result);
                    setUpdateData((prevState) => ({
                        ...prevState,
                        avatar: newFileName
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            setUpdateData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value
            }));
            if (e.target.value === "") {
                setErrorMsg("");
            }
        }
    }

    // Check Error
    const checkError = (e) => {

        const valid = validate(e.target.name, e.target.value)

        setUpdateDataError((prevState) => ({
            ...prevState,
            [e.target.name + 'Error']: valid
        }))

    }

    /////////////////////////////////////////////////////////////////////// UPDATE PROFILE

    // Toogle Update
    const toggleUpdate = () => {
        if (showUpdate) {
            const updateInput = async () => {
                try {
                    const fetched = await updateOwnProfileService(userToken, updateData)
                    if (!fetched?.success) {
                        setErrorMsg(fetched?.message)
                        setTimeout(() => {
                            setErrorMsg("")
                        }, 2000);
                        throw new Error(fetched?.error)
                    } else {
                        setUserInfo((prevState) => ({
                            ...prevState,
                            name: fetched?.data?.name,
                            bio: fetched?.data?.bio,
                            avatar: fetched?.data?.avatar,
                            email: fetched?.data?.email
                        }))
                        setShowUpdate(false)
                    }
                    if (updateAvatar && userInfo) {
                        try {
                            const uploaded = await uploadAvatarService(updateAvatar)
                            if (!uploaded?.success) {
                                setErrorMsg(uploaded?.message)
                                setTimeout(() => {
                                    setErrorMsg("")
                                }, 2000);
                                throw new Error(uploaded?.message)
                            }
                        } catch (error) {
                            if (error?.message === "TOKEN NOT FOUND" || error?.message === "TOKEN INVALID" || error?.message === "TOKEN ERROR") {
                                dispatch(logout({ credentials: {} }))
                                navigate('/')
                            } else {
                                console.log(error);
                            }
                        }
                    }
                } catch (error) {
                    if (error?.message === "TOKEN NOT FOUND" || error?.message === "TOKEN INVALID" || error?.message === "TOKEN ERROR") {
                        dispatch(logout({ credentials: {} }))
                        navigate('/')
                    } else {
                        console.log(error);
                    }
                }
            }
            updateInput()
        } else {
            setShowUpdate(true)
            setUpdateData({
                name: "",
                bio: "",
                avatar: "",
                email: "",
                password: "",
                confirmPassword: ""
            })
            setUpdateAvatar(null)
            setAvatarPreview(userInfo?.avatar)
        }
    }

    /////////////////////////////////////////////////////////////////////// DELETE PROFILE

    // Delete Profile
    const deleteProfileInput = async () => {
        try {
            const fetched = await deleteOwnProfileService(userToken)
            if (!fetched?.success) {
                throw new Error(fetched?.message)
            }
            dispatch(logout({ credentials: {} }))
            navigate('/')
        } catch (error) {
            if (error?.message === "TOKEN NOT FOUND" || error?.message === "TOKEN INVALID" || error?.message === "TOKEN ERROR") {
                dispatch(logout({ credentials: {} }))
                navigate('/')
            } else {
                console.log(error);
            }
        }
    }

    // Toggle Delete button
    const toggleDelete = () => {
        setShowConfirm(prevState => !prevState)
    }

    /////////////////////////////////////////////////////////////////////// DELETE UPLOAD

    // Toggle delete update button
    const toggleDeleteUpload = () => {
        setShowDeleteUpload(prevState => !prevState)
    }

    // Delete upload
    const deleteUploadInput = async (index) => {
        try {
            const fetched = await deleteOwnUploadService(userToken, userInfo?.uploads[index]?.id)
            if (!fetched?.success) {
                throw new Error(fetched?.message)
            }
            setUserUploads(fetched?.data)
            const getUploadFiles = async () => {
                const uploadsUrl = []
                try {
                    fetched?.data.map(async (upload) => {
                        const fileFetched = await getUploadFileService(upload.id)
                        const fileUrl = URL.createObjectURL(fileFetched)
                        uploadsUrl.push(fileUrl)
                    })
                    setUploadFiles(uploadsUrl)
                } catch (error) {
                    console.log(error);
                }
            }
            getUploadFiles()
        } catch (error) {
            if (error?.message === "TOKEN NOT FOUND" || error?.message === "TOKEN INVALID" || error?.message === "TOKEN ERROR") {
                dispatch(logout({ credentials: {} }))
                navigate('/')
            } else {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        console.log("cambio en userUploads ->   ", userUploads);
    }, [userUploads])

    // follow/unfollow
    const followUnfollowInput = async () => {
        try {
            if (userSelected) {
                const fetched = await followUnfollowService(userToken, userInfo.id)
                if (!fetched) {
                    throw new Error(fetched.message)
                }
            }
        } catch (error) {
            if (error?.message === "TOKEN NOT FOUND" || error?.message === "TOKEN INVALID" || error?.message === "TOKEN ERROR") {
                dispatch(logout({ credentials: {} }))
                navigate('/')
            } else {
                console.log(error);
            }
        }
    }

    /////////////////////////////////////////////////////////////////////// RETURN

    return (
        <div className="profile-design">
            {/* UPLOADS */}
            <div className="uploads-card">
                {
                    userUploads === null
                        ? <CText title={'You have no models uploaded!'} />
                        : loading.uploadLoading
                            ? <CText title={'Loading'} />
                            // UPLOADS CARDS
                            : (
                                <CCard className={'userUploads-card'}>
                                    {
                                        uploadFiles.map((upload, index) => {
                                            return (
                                                <CCard key={`${index}-${userInfo?.name}`}>
                                                    <CText title={userInfo?.uploads[index]?.name?.split(".")[0]} />
                                                    <Viewport viewportSize={{ width: 800, height: 400 }} asset={upload} />
                                                    {
                                                        userToken && !userSelected
                                                            ? (
                                                                <div className="deleteModel">
                                                                    <X onClick={() => toggleDeleteUpload()} className={showDeleteUpload ? 'hidden' : ""} />
                                                                    <CText className={showDeleteUpload ? "" : 'hidden'} title={'delete model?'} />
                                                                    <div className={showDeleteUpload ? 'confirm' : 'hidden'}>
                                                                        <Check onClick={() => deleteUploadInput(index)} />
                                                                        <X onClick={() => toggleDeleteUpload()} />
                                                                    </div>
                                                                </div>
                                                            )
                                                            : null
                                                    }
                                                </CCard>
                                            )
                                        })
                                    }
                                </CCard>
                            )
                }
            </div>
            {/* USER */}
            <div className="user-card">
                {
                    loading.infoLoading
                        ? <CText title={'Loading'} />
                        : (
                            <CCard className={'userInfo-Card'}>
                                {
                                    showUpdate
                                        // UPDATE PROFILE CARD
                                        ? (
                                            <form
                                                action="http://localhost:4000/api/file/avatar"
                                                encType="multipart/form-data"
                                                method="post"
                                            >
                                                <div className="update-inputs">
                                                    <div className="update-info">
                                                        <div className="author-avatar">
                                                            <label
                                                                disabled={errorMsg === "" ? false : errorMsg === updateDataError?.avatarError ? false : true}
                                                                htmlFor='photo'
                                                                className={'uploadPhotoInput'}
                                                                onChange={(e) => inputHandler(e)}>
                                                                <img
                                                                    src={userAvatar}
                                                                    alt={`${userInfo?.name}'s avatar`}
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.style.display = 'none';
                                                                        e.target.nextElementSibling.style.display = 'flex';
                                                                    }}
                                                                />
                                                                <div className="noAvatar" style={{ display: 'none' }}>{userInfo?.name?.split("")[0].toUpperCase()}</div>
                                                            </label>
                                                        </div>
                                                        <CInput
                                                            disabled={errorMsg === "" ? false : errorMsg === updateDataError?.avatarError ? false : true}
                                                            className={'fileInputHidden'}
                                                            id={'photo'}
                                                            type={"file"}
                                                            name={"avatar"}
                                                            value={""}
                                                            onChange={(e) => inputHandler(e)}
                                                            onBlur={(e) => checkError(e)}
                                                        />
                                                        <CInput
                                                            disabled={errorMsg === "" ? false : errorMsg === updateDataError?.bioError ? false : true}
                                                            name={'bio'}
                                                            className={'text-area'}
                                                            type={'textarea'}
                                                            value={updateData?.bio || ""}
                                                            placeholder={'input bio'}
                                                            onChange={(e) => inputHandler(e)}
                                                            onBlur={(e) => checkError(e)}
                                                        />
                                                        <CInput
                                                            disabled={errorMsg === "" ? false : errorMsg === updateDataError?.nameError ? false : true}
                                                            name={'name'}
                                                            type={'text'}
                                                            value={updateData?.name || ""}
                                                            placeholder={'input name'}
                                                            onChange={(e) => inputHandler(e)}
                                                            onBlur={(e) => checkError(e)}
                                                        />
                                                        <CInput
                                                            disabled={errorMsg === "" ? false : errorMsg === updateDataError?.emailError ? false : true}
                                                            name={'email'}
                                                            type={'text'}
                                                            value={updateData?.email || ""}
                                                            placeholder={'input email'}
                                                            onChange={(e) => inputHandler(e)}
                                                            onBlur={(e) => checkError(e)}
                                                        />
                                                        <CInput
                                                            disabled={errorMsg === "" ? false : errorMsg === updateDataError?.passwordError ? false : true}
                                                            name={'password'}
                                                            type={'password'}
                                                            value={updateData?.password || ""}
                                                            placeholder={'input password'}
                                                            onChange={(e) => inputHandler(e)}
                                                            onBlur={(e) => checkError(e)}
                                                        />
                                                        <div className={'update-button'}>
                                                            <CButton
                                                                title={'Update'}
                                                                onClick={errorMsg !== "" ? null : () => toggleUpdate()}
                                                                className={errorMsg !== "" ? 'update-disabled' : 'button-update'} />
                                                            <CButton
                                                                title={'Delete'}
                                                                onClick={errorMsg !== "" ? null : () => toggleDelete()}
                                                                className={showUpdate && !showConfirm ? 'button-delete' : 'hidden'} />
                                                            <div className="confirm">
                                                                <CButton
                                                                    title={'confirm'}
                                                                    className={showConfirm ? 'button-delete-yes' : 'hidden'}
                                                                    onClick={() => deleteProfileInput()} />
                                                                <CButton
                                                                    title={'cancel'}
                                                                    className={showConfirm ? 'button-delete-no' : 'hidden'}
                                                                    onClick={() => toggleDelete()} />
                                                            </div>
                                                        </div>
                                                        <CText title={errorMsg} />
                                                    </div>
                                                </div>
                                            </form>
                                        )
                                        // PROFILE CARD
                                        : (
                                            <>
                                                {
                                                    userInfo?.avatar !== `${userInfo?.name}-undefined`
                                                        ? (
                                                            <div className="author-avatar">
                                                                <label
                                                                    disabled={errorMsg === "" ? false : errorMsg === updateDataError?.avatarError ? false : true}
                                                                    htmlFor='photo'
                                                                    className={'uploadPhotoInput'}
                                                                    onChange={(e) => inputHandler(e)}
                                                                    onBlur={(e) => checkError(e)}>
                                                                    <img
                                                                        src={userAvatar}
                                                                        alt={`${userInfo?.name}'s avatar`}
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextElementSibling.style.display = 'flex';
                                                                        }}
                                                                    />
                                                                    <div className="noAvatar" style={{ display: 'none' }}>{userInfo?.name?.split("")[0].toUpperCase()}</div>
                                                                </label>
                                                                <div className="info">
                                                                    <div className="icons-info">
                                                                        <Heart />
                                                                        <CText className={'text-iconsInfo'} title={userInfo?.likes?.length} />
                                                                    </div>
                                                                    <div className="icons-info">
                                                                        <MessageSquare />
                                                                        <CText className={'text-iconsInfo'} title={userInfo?.uploadComments?.length} />
                                                                    </div>
                                                                    <div className="icons-info">
                                                                        <UserCheck onClick={() => followUnfollowInput()} />
                                                                        <CText className={'text-iconsInfo'} title={userInfo?.following?.length} />
                                                                    </div>
                                                                    <div className="icons-info">
                                                                        <UserRoundCheck />
                                                                        <CText className={'text-iconsInfo'} title={userInfo?.followers?.length} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="noAvatar Profile">{userInfo?.name?.split("")[0].toUpperCase()}</div>
                                                        )
                                                }
                                                < CText className={'text-infoTitle'} title={'name'} />
                                                <CText className={'text-userInfo'} title={userInfo?.name} />
                                                <CText className={'text-infoTitle'} title={'biography'} />
                                                <CText className={'text-userInfo'} title={userInfo?.bio} />
                                                <CText className={'text-infoTitle'} title={'email'} />
                                                <CText className={'text-userInfo'} title={userInfo?.email} />
                                                <div className={userSelected ? 'hidden' : 'update-button'}>
                                                    <CButton
                                                        title={'Update'}
                                                        onClick={errorMsg !== "" ? null : () => toggleUpdate()}
                                                        className={errorMsg !== "" ? 'update-disabled' : 'button-update'} />
                                                </div>
                                            </>
                                        )
                                }
                            </CCard>
                        )
                }
            </div>
        </div>
    )
}