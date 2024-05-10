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
import { getAvatarService, getOwnProfileService, getUploadFileService, updateOwnProfileService, uploadAvatarService } from '../../services/apiCalls';

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
    const userToken = rdxUser.credentials.userToken
    const reader = new FileReader()
    let file
    let newFile
    let newFileName

    /////////////////////////////////////////////////////////////////////// HOOKS
    const [userInfo, setUserInfo] = useState(null)
    const [userUploads, setUserUploads] = useState(null)
    const [userAvatar, setUserAvatar] = useState(null)
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

    /////////////////////////////////////////////////////////////////////// LOGIC

    // Change document title
    useEffect(() => {
        !rdxUser?.credentials?.userToken
            ? navigate('/')
            : (document.title = `${rdxUser?.credentials?.userTokenData?.userName}'s Profile`)
    }, [])

    // Input Handler
    const inputHandler = (e) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file) {
                const newFileName = `${userInfo.name}-${file.name}`;
                const newFile = new File([file], newFileName, { type: file.type });
                setUpdateAvatar(newFile);
                const reader = new FileReader();
                reader.onload = (event) => {
                    setAvatarPreview(event.target.result);
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

    // Get Profile
    useEffect(() => {
        const getProfile = async () => {
            try {
                const userFetched = await getOwnProfileService(userToken)
                if (!userFetched.success) {
                    throw new Error(userFetched.message)
                }
                const avatarFetched = await getAvatarService(userFetched.data.avatar.split("-")[1], userToken)
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

    // Get User's Uploads
    useEffect(() => {
        const fetchUploads = async () => {
            if (userInfo && userInfo.uploads.length !== 0 && !userUploads) {
                const urls = [];
                for (const upload of userInfo.uploads) {
                    try {
                        const fetchedFile = await getUploadFileService(upload.id);
                        const uploadUrl = URL.createObjectURL(fetchedFile);
                        urls.push(uploadUrl);
                    } catch (error) {
                        console.error(error);
                        urls.push(null);
                    }
                }
                const validUrls = urls.filter(url => url !== null);
                setUserUploads(validUrls);
                setLoading(prevState => ({
                    ...prevState,
                    uploadLoading: false
                }));
            }
        };

        fetchUploads();
    }, [userInfo, userUploads]);

    // Toogle Update
    const toggleUpdate = () => {
        if (showUpdate) {
            const updateInput = async () => {
                try {
                    if (updateAvatar) {
                        const Uploaded = await uploadAvatarService(updateAvatar)
                        if (!Uploaded.success) {
                            setErrorMsg(Uploaded.message)
                            setTimeout(() => {
                                setErrorMsg("")
                            }, 2000);
                            throw new Error(Uploaded.error)
                        }
                    }
                    const fetched = await updateOwnProfileService(userToken, updateData)
                    if (!fetched.success) {
                        setErrorMsg(fetched.message)
                        setTimeout(() => {
                            setErrorMsg("")
                        }, 2000);
                    } else {
                        setShowUpdate(false)
                    }
                } catch (error) {
                    console.log(error);
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
            setAvatarPreview(userInfo.avatar)
        }
    }

    /////////////////////////////////////////////////////////////////////// RETURN

    return (
        <div className="profile-design">
            <div className="uploads-card">
                {
                    userUploads === null
                        ? <CText title={'You have no models uploaded!'} />
                        : loading.uploadLoading
                            ? <CText title={'Loading'} />
                            : (
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
                }
            </div>
            <div className="user-card">
                {
                    loading.infoLoading
                        ? <CText title={'Loading'} />
                        : (
                            <CCard className={'userInfo-Card'}>
                                {
                                    showUpdate
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
                                                                disabled={errorMsg === "" ? false : errorMsg === updateDataError.avatarError ? false : true}
                                                                htmlFor='photo'
                                                                className={'uploadPhotoInput'}
                                                                onChange={(e) => inputHandler(e)}>
                                                                <img
                                                                    src={avatarPreview || userAvatar}
                                                                    alt={`${userInfo.name}'s avatar`}
                                                                />
                                                            </label>
                                                        </div>
                                                        <CInput
                                                            disabled={errorMsg === "" ? false : errorMsg === updateDataError.avatarError ? false : true}
                                                            className={'fileInputHidden'}
                                                            id={'photo'}
                                                            type={"file"}
                                                            name={"avatar"}
                                                            value={""}
                                                            onChange={(e) => inputHandler(e)}
                                                            onBlur={(e) => checkError(e)}
                                                        />
                                                        <CInput
                                                            disabled={errorMsg === "" ? false : errorMsg === updateDataError.bioError ? false : true}
                                                            name={'bio'}
                                                            className={'text-area'}
                                                            type={'textarea'}
                                                            value={updateData.bio || ""}
                                                            placeholder={'input bio'}
                                                            onChange={(e) => inputHandler(e)}
                                                            onBlur={(e) => checkError(e)}
                                                        />
                                                        <CInput
                                                            disabled={errorMsg === "" ? false : errorMsg === updateDataError.nameError ? false : true}
                                                            name={'name'}
                                                            type={'text'}
                                                            value={updateData.name || ""}
                                                            placeholder={'input name'}
                                                            onChange={(e) => inputHandler(e)}
                                                            onBlur={(e) => checkError(e)}
                                                        />
                                                        <CInput
                                                            disabled={errorMsg === "" ? false : errorMsg === updateDataError.emailError ? false : true}
                                                            name={'email'}
                                                            type={'text'}
                                                            value={updateData.email || ""}
                                                            placeholder={'input email'}
                                                            onChange={(e) => inputHandler(e)}
                                                            onBlur={(e) => checkError(e)}
                                                        />
                                                        <CInput
                                                            disabled={errorMsg === "" ? false : errorMsg === updateDataError.passwordError ? false : true}
                                                            name={'password'}
                                                            type={'password'}
                                                            value={updateData.password || ""}
                                                            placeholder={'input password'}
                                                            onChange={(e) => inputHandler(e)}
                                                            onBlur={(e) => checkError(e)}
                                                        />
                                                        <div className="update-button">
                                                            <CButton
                                                                title={'Update'}
                                                                onClick={errorMsg !== "" ? null : () => toggleUpdate()}
                                                                className={errorMsg !== "" ? 'update-disabled' : 'button-update'} />
                                                        </div>
                                                        <CText title={errorMsg} />
                                                    </div>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                {
                                                    userInfo.avatar !== `${userInfo.name}-undefined`
                                                        ? (
                                                            <div className="author-avatar">
                                                                <label
                                                                    disabled={errorMsg === "" ? false : errorMsg === updateDataError.avatarError ? false : true}
                                                                    htmlFor='photo'
                                                                    className={'uploadPhotoInput'}
                                                                    onChange={(e) => inputHandler(e)}
                                                                    onBlur={(e) => checkError(e)}>
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
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="noAvatar Profile">{userInfo.name.split("")[0].toUpperCase()}</div>
                                                        )
                                                }
                                                < CText className={'text-infoTitle'} title={'name'} />
                                                <CText className={'text-userInfo'} title={userInfo.name} />
                                                <CText className={'text-infoTitle'} title={'biography'} />
                                                <CText className={'text-userInfo'} title={userInfo.bio} />
                                                <CText className={'text-infoTitle'} title={'email'} />
                                                <CText className={'text-userInfo'} title={userInfo.email} />
                                                <div className="update-button">
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