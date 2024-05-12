// Styles
import './header.css'

// Lucide
import { X } from "lucide-react";

// Methods/Modules
import { useState, useEffect } from "react";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { userData, login, logout } from "../../app/slices/userSlice";

// Api Calls
import { createNewUpload, loginService, logoutService, registerService, uploadAvatarService, uploadModelService } from '../../services/apiCalls';

// Custom Methods
import { validate } from "../../utils/validator";

// Custom Elements
import { CCard } from "../C-card/cCard";
import { CInput } from "../C-input/cInput";
import { CButton } from "../C-button/cButton";
import { CText } from '../C-text/cText';
import { Viewport } from "../Three-Viewport/viewport";
import { removeUser } from '../../app/slices/detailSlice';

export const Header = () => {

    /////////////////////////////////////////////////////////////////////// INSTANCES
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const rdxUser = useSelector(userData)
    const userToken = rdxUser.credentials.userToken
    const reader = new FileReader()
    let file
    let newFileName
    let newFile

    /////////////////////////////////////////////////////////////////////// HOOKS
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [showUpload, setShowUpload] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    // Upload Data
    const [uploadData, setUploadData] = useState({
        name: "",
        description: "",
        downloadable: false,
        file: null
    })
    const [uploadDataError, setUploadDataError] = useState({
        nameError: "",
        descriptionError: "",
    })
    const [uploadFile, setUploadFile] = useState(null)
    const [uploadFileError, setUploadFileError] = useState("")
    const [uploadFileUrl, setUploadFileUrl] = useState(null)
    const [resetViewport, setResetViewport] = useState(false)

    // Login Data
    const [registerData, setRegisterData] = useState({
        avatar: "",
        name: "",
        email: "",
        password: ""
    })
    const [registerDataError, setRegisterDataError] = useState({
        avatarError: "",
        nameError: "",
        emailError: "",
        passwordError: ""
    })
    const [registerAvatar, setRegisterAvatar] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState('../../../img/default-ProfileImg.png')

    // Register Data
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })
    const [loginDataError, setLoginDataError] = useState({
        emailError: "",
        passwordError: ""
    })

    /////////////////////////////////////////////////////////////////////// USE EFFECTS

    /////////////////////////////////////////////////////////////////////// LOGIC
    // Input Handler
    const inputHandler = (e) => {
        showLogin
            ? (
                setLoginData((prevState) => ({
                    ...prevState,
                    [e.target.name]: e.target.value
                }))
            )
            : null

        showRegister
            ? (
                e.target.files
                    ? (
                        file = e.target.files[0],
                        file && registerData.name
                            ? (
                                newFileName = `${registerData.name}-${file.name}`,
                                newFile = new File([file], newFileName, { type: file.type }),
                                setRegisterAvatar(newFile),
                                reader.onload = (event) => {
                                    setAvatarPreview(event.target.result)
                                    setRegisterData((prevState) => ({
                                        ...prevState,
                                        avatar: newFileName
                                    }))
                                },
                                reader.readAsDataURL(newFile)
                            ) : (
                                setErrorMsg('Before selecting avatar enter your name'),
                                setTimeout(() => {
                                    setErrorMsg('')
                                }, 2000)
                            )
                    )
                    : (
                        setRegisterData((prevState) => ({
                            ...prevState,
                            [e.target.name]: e.target.value
                        }))
                    )
            )
            : null

        showUpload
            ? (
                e.target.files
                    ? (
                        file = e.target.files[0],
                        file
                            ? (
                                file.name.endsWith('fbx')
                                    ? (
                                        setUploadFile(file),
                                        setUploadFileUrl(URL.createObjectURL(file)),
                                        setUploadData((prevState) => ({
                                            ...prevState,
                                            name: file.name
                                        }))
                                    )
                                    : (
                                        setUploadFileError('Model has to be in FBX format!'),
                                        setErrorMsg(uploadFileError),
                                        setTimeout(() => {
                                            setErrorMsg("")
                                        }, 2000),
                                        setUploadFile(null),
                                        setUploadFileUrl(null),
                                        setUploadData((prevState) => ({
                                            ...prevState,
                                            file: null
                                        }))
                                    )
                            )
                            : null
                    )
                    : e.target.name !== 'downloadable'
                        ? (
                            setUploadData((prevState) => ({
                                ...prevState,
                                [e.target.name]: e.target.value
                            }))
                        )
                        : (
                            setUploadData((prevState) => ({
                                ...prevState,
                                downloadable: e.target.checked
                            }))
                        )
            )
            : null
        if (e.target.value === "") {
            setErrorMsg("")
        }

    }

    // Check Error
    const checkError = (e) => {

        const valid = validate(e.target.name, e.target.value)

        showLogin
            ? (
                setLoginDataError((prevState) => ({
                    ...prevState,
                    [e.target.name + 'Error']: valid
                }))
            )
            : null

        showRegister
            ? (
                setRegisterDataError((prevState) => ({
                    ...prevState,
                    [e.target.name + 'Error']: valid
                }))
            )
            : null
        showUpload
            ? (
                setUploadDataError(prevState => ({
                    ...prevState,
                    [e.target.name + 'Error']: valid
                }))
            )
            : null
    }

    // Link errors with errorsMsg
    useEffect(() => {
        let allErrorsCleared
        if (showLogin) {
            for (let element in loginDataError) {
                if (loginDataError[element] !== "") {
                    setErrorMsg(loginDataError[element])
                    break
                }
            }
            allErrorsCleared = Object.values(loginDataError).every(value => value === "")
        } else if (showRegister) {
            for (let element in registerDataError) {
                if (registerDataError[element] !== "") {
                    setErrorMsg(registerDataError[element])
                    break
                }
                allErrorsCleared = Object.values(registerDataError).every(value => value === "")
            }
        } else if (showUpload) {
            for (let element in uploadDataError) {
                if (uploadDataError[element] !== "") {
                    setErrorMsg(uploadDataError[element])
                    break
                }
            }
            allErrorsCleared = Object.values(uploadDataError).every(value => value === "")
        }
        allErrorsCleared ? setErrorMsg("") : null
    }, [loginDataError, registerDataError, uploadDataError])

    /////////////////////////////////////////////////////////////////////// LOGIN
    // Login Call
    const loginInput = async () => {
        try {
            const fetched = await loginService(loginData)
            if (!fetched.success) {
                setErrorMsg(fetched.message)
                setTimeout(() => {
                    setErrorMsg("")
                }, 2000);
                throw new Error(fetched.message)
            }

            if (fetched.data) {
                const token = fetched.data.token
                const decodedToken = decodeToken(token)

                const passport = {
                    userToken: token,
                    userTokenData: decodedToken
                }
                dispatch(login({ credentials: passport }))
                navigate('/profile')
            }
            setShowLogin(false)
        } catch (error) {
            if (error === "TOKEN NOT FOUND" || error === "TOKEN INVALID" || error === "TOKEN ERROR") {
                dispatch(logout({ credentials: {} }));
            } else {
                console.log(error);
            }
        }
    }
    // Toogle login card
    const toggleLogin = () => {
        setShowRegister(false)
        showLogin
            ? setShowLogin(false)
            : (setShowLogin(true),
                setLoginData({
                    email: "",
                    password: ""
                }),
                setLoginDataError({
                    emailError: "",
                    passwordError: ""
                })
            )
    }

    /////////////////////////////////////////////////////////////////////// LOGOUT
    // Logout Call
    const logoutInput = async () => {
        try {
            const fetched = await logoutService(userToken)
            // console.log(fetched);
            if (!fetched.success) {
                throw new Error(fetched.message)
            }
            dispatch(logout({ credentials: {} }))
            navigate('/')
        } catch (error) {
            if (error.message === "TOKEN NOT FOUND" || error.message === "TOKEN INVALID" || error.message === "TOKEN ERROR") {
                dispatch(logout({ credentials: {} }))
                navigate('/')
            } else {
                console.log(error);
            }
        }
    }

    /////////////////////////////////////////////////////////////////////// REGISTER
    // Register Call
    const registerInput = async () => {
        try {
            if (registerAvatar) {
                const Uploaded = await uploadAvatarService(registerAvatar)
                if (!Uploaded.success) {
                    setErrorMsg(Uploaded.message)
                    setTimeout(() => {
                        setErrorMsg("")
                    }, 2000);
                    throw new Error(Uploaded.message)
                }
            }
            const fetched = await registerService(registerData)
            if (!fetched.success) {
                setErrorMsg(fetched.message)
                setTimeout(() => {
                    setErrorMsg("")
                }, 2000);
                throw new Error(fetched.message)
            }
            setShowRegister(false)
            setShowLogin(true)
        } catch (error) {
            if (error === "TOKEN NOT FOUND" || error === "TOKEN INVALID" || error === "TOKEN ERROR") {
                dispatch(logout({ credentials: {} }));
            } else {
                console.log(error);
            }
        }
    }
    // Toogle register card
    const toggleRegister = () => {
        setShowLogin(false)
        showRegister
            ? setShowRegister(false)
            : (setShowRegister(true),
                setRegisterData({
                    email: "",
                    password: ""
                }),
                setRegisterDataError({
                    emailError: "",
                    passwordError: ""
                })),
            setAvatarPreview('../../../img/default-ProfileImg.png')
    }

    // Hide Cards when clicking outside
    const hideCard = (e) => {
        showLogin
            ? (
                e.target.classList[0] === 'welcome-overlay'
                    ? setShowLogin(false)
                    : null
            ) : null
        showRegister
            ? (
                e.target.classList[0] === 'welcome-overlay'
                    ? setShowRegister(false)
                    : null
            ) : null
        showUpload
            ? (
                e.target.classList[0] === 'welcome-overlay'
                    ? (
                        setShowUpload(false),
                        setResetViewport(true)
                    )
                    : null
            ) : null
    }

    /////////////////////////////////////////////////////////////////////// PROFILE

    const goToProfile = () => {
        dispatch(removeUser({
            userId: "",
            userName: ""
        }))
        navigate('/profile')
    }
    const goToSuperadmin = ()=>{
        navigate('/superadmin')
    }

    /////////////////////////////////////////////////////////////////////// UPLOAD

    const uploadInput = async () => {
        try {
            const uploaded = await uploadModelService(userToken, uploadFile)
            if (!uploaded.success) {
                setErrorMsg(uploaded.message)
                setTimeout(() => {
                    setErrorMsg("")
                }, 2000);
                throw new Error(uploaded.message)
            }
            const fetched = await createNewUpload(userToken, uploadData)
            if (!fetched.success) {
                setErrorMsg(fetched.message)
                setTimeout(() => {
                    setErrorMsg("")
                }, 2000);
                throw new Error(fetched.message)
            }
            setShowUpload(false)
        } catch (error) {
            if (error.message === "TOKEN NOT FOUND" || error.message === "TOKEN INVALID" || error.message === "TOKEN ERROR") {
                dispatch(logout({ credentials: {} }))
                navigate('/')
            } else {
                console.log(error);
            }
        }
    }

    const toggleUpload = () => {
        showUpload
            ? (
                setShowUpload(false),
                setResetViewport(false)
            )
            : (
                setUploadData({
                    name: "",
                    description: "",
                    downloadable: false,
                    file: null
                }),
                setUploadDataError({
                    nameError: "",
                    descriptionError: ""
                }),
                setUploadFile(null),
                setUploadFileUrl(null),
                setResetViewport(true),
                setShowUpload(true)
            )
    }

    console.log(rdxUser.credentials.userTokenData);
    /////////////////////////////////////////////////////////////////////// RETURN

    return (
        <div className="header-design">
            <CButton className={'home-button'} title={'home'} onClick={() => navigate('/')} />
            {
                rdxUser?.credentials?.userTokenData?.roleName === 'superadmin'
                    ? <CButton className={'superadmin-button'} title={'superadmin'} onClick={()=>goToSuperadmin()}/>
                    : null
            }
            <div className="separator-header"></div>
            {
                rdxUser.credentials.userToken
                    ? (
                        <div className="buttons-logged">
                            <CButton className={'button-profile'}
                                title={`${rdxUser.credentials.userTokenData.userName}`}
                                onClick={() => goToProfile()}
                            />
                            <CButton
                                className={'button-upload'}
                                title={'upload'}
                                onClick={() => toggleUpload()}
                            />
                            <CButton
                                className={'button-logout'}
                                title={'logout'}
                                onClick={() => logoutInput()}
                            />
                            {/* Upload Card */}
                            <div onClick={(e) => hideCard(e)} className={showUpload ? 'welcome-overlay' : 'hidden'}>
                                <CCard className={showUpload ? "card-upload" : 'hidden'}>
                                    <div className="closeCard"><X onClick={() => toggleUpload()} className='icon-closeCard' /></div>
                                    <div className="upload-inputs">
                                        <div className="upload-info">
                                            <CInput
                                                disabled={errorMsg === "" ? false : errorMsg === uploadData.description ? false : true}
                                                name={'description'}
                                                type={'textarea'}
                                                value={uploadData.description || ""}
                                                placeholder={'input description'}
                                                onChange={(e) => inputHandler(e)}
                                                onBlur={(e) => checkError(e)}
                                            />
                                            <CInput
                                                disabled={errorMsg === "" ? false : errorMsg === uploadData.file ? false : true}
                                                name={'file'}
                                                type={'file'}
                                                value={""}
                                                onChange={(e) => inputHandler(e)}
                                                onBlur={(e) => checkError(e)}
                                            />
                                            {
                                                showUpload && <Viewport asset={uploadFileUrl} reset={resetViewport} />
                                            }
                                            <CInput
                                                disabled={errorMsg === "" ? false : errorMsg === uploadData.downloadable ? false : true}
                                                name={'downloadable'}
                                                type={'checkbox'}
                                                value={uploadData.downloadable}
                                                onChange={(e) => inputHandler(e)}
                                                onBlur={(e) => checkError(e)}
                                            />
                                            <div className="upload-button">
                                                <CButton
                                                    onClick={() => uploadInput()}
                                                    className={errorMsg === "" ? 'button-upload' : 'upload-disabled'}
                                                    title={'upload'} />
                                                <CText title={errorMsg} />
                                            </div>
                                        </div>
                                    </div>
                                </CCard>
                            </div>
                        </div>
                    )
                    : (
                        <div className="buttons-not-logged">
                            <CButton className={'button-loggin'} title={'login'} onClick={() => toggleLogin()} />
                            <CButton className={'button-register'} title={'register'} onClick={() => toggleRegister()} />

                            {/* Loggin Card */}
                            <div onClick={(e) => hideCard(e)} className={showLogin ? 'welcome-overlay' : 'hidden'}>
                                <CCard className={showLogin ? "card-login" : 'hidden'}>
                                    <div className="closeCard"><X onClick={() => toggleLogin()} className='icon-closeCard' /></div>
                                    <div className="login-inputs">
                                        <CText className={'text-infoTitle-top'} title={'Loggin!'} />
                                        <CText className={'text-subtitle'} title={'Welcome back!'} />
                                        <div className="login-info">
                                            <CText className={'text-infoTitle-inputs'} title={'Email'} />
                                            <CInput
                                                disabled={errorMsg === "" ? false : errorMsg === loginDataError.emailError ? false : true}
                                                name={'email'}
                                                type={'text'}
                                                value={loginData.email || ""}
                                                placeholder={'input email'}
                                                onChange={(e) => inputHandler(e)}
                                                onBlur={(e) => checkError(e)}
                                            />
                                            <CText className={'text-infoTitle-inputs'} title={'Password'} />
                                            <CInput
                                                disabled={errorMsg === "" ? false : errorMsg === loginDataError.passwordError ? false : true}
                                                name={'password'}
                                                type={'password'}
                                                value={loginData.password || ""}
                                                placeholder={'input password'}
                                                onChange={(e) => inputHandler(e)}
                                                onBlur={(e) => checkError(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="separator"></div>
                                    <div className="login-button">
                                        <CButton onClick={errorMsg === "" ? () => loginInput() : null} className={errorMsg === "" ? 'button-loggin' : 'loggin-disabled'} title={'login'} />
                                        <CText title={errorMsg} />
                                    </div>
                                </CCard>
                            </div>

                            {/* Register Card */}
                            <div onClick={(e) => hideCard(e)} className={showRegister ? "welcome-overlay" : 'hidden'}>
                                <CCard className={showRegister ? "card-register" : 'hidden'}>
                                    <div className="closeCard"><X onClick={() => toggleRegister()} className='icon-closeCard' /></div>
                                    <CText className={'text-infoTitle-top'} title={'Register!'} />
                                    <CText className={'text-subtitle'} title={'Welcome to Checkpoint!'} />
                                    <form
                                        action="http://localhost:4000/api/file/avatar"
                                        encType="multipart/form-data"
                                        method="post"
                                    >
                                        <div className="register-inputs">
                                            <div className="register-info">
                                                <label
                                                    disabled={errorMsg === "" ? false : errorMsg === registerDataError.avatarError ? false : true}
                                                    htmlFor='photo'
                                                    className={'uploadPhotoInput'}
                                                    onChange={(e) => inputHandler(e)}
                                                    onBlur={(e) => checkError(e)}>
                                                    <img src={avatarPreview} alt="default-profileImg" />
                                                </label>
                                                <CInput
                                                    disabled={errorMsg === "" ? false : errorMsg === registerDataError.avatarError ? false : true}
                                                    className={'fileInputHidden'}
                                                    id={'photo'}
                                                    type={"file"}
                                                    name={"avatar"}
                                                    value={""}
                                                    onChange={(e) => inputHandler(e)}
                                                    onBlur={(e) => checkError(e)}
                                                />
                                                <CText className={'text-infoTitle-inputs'} title={'Name'} />
                                                <CInput
                                                    disabled={errorMsg === "" ? false : errorMsg === registerDataError.nameError ? false : true}
                                                    name={'name'}
                                                    type={'text'}
                                                    value={registerData.name || ""}
                                                    placeholder={'input name'}
                                                    onChange={(e) => inputHandler(e)}
                                                    onBlur={(e) => checkError(e)}
                                                />
                                                <CText className={'text-infoTitle-inputs'} title={'Email'} />
                                                <CInput
                                                    disabled={errorMsg === "" ? false : errorMsg === registerDataError.emailError ? false : true}
                                                    name={'email'}
                                                    type={'text'}
                                                    value={registerData.email || ""}
                                                    placeholder={'input email'}
                                                    onChange={(e) => inputHandler(e)}
                                                    onBlur={(e) => checkError(e)}
                                                />
                                                <CText className={'text-infoTitle-inputs'} title={'Password'} />
                                                <CInput
                                                    disabled={errorMsg === "" ? false : errorMsg === registerDataError.passwordError ? false : true}
                                                    name={'password'}
                                                    type={'password'}
                                                    value={registerData.password || ""}
                                                    placeholder={'input password'}
                                                    onChange={(e) => inputHandler(e)}
                                                    onBlur={(e) => checkError(e)}
                                                />
                                            </div>
                                            <div className="separator"></div>
                                        </div>
                                        <div className="register-button">
                                            <CButton onClick={errorMsg === "" ? (e) => registerInput(e) : null} className={errorMsg === "" ? 'button-register' : 'register-disabled'} title={'register'} />
                                            <CText title={errorMsg} />
                                        </div>
                                    </form>
                                </CCard>
                            </div>
                        </div>
                    )
            }

        </div>
    )
}