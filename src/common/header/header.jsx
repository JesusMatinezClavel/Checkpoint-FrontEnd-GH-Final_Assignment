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
import { loginService, logoutService, registerService, uploadAvatarService } from '../../services/apiCalls';

// Custom Methods
import { validate } from "../../utils/validator";

// Custom Elements
import { CCard } from "../C-card/cCard";
import { CInput } from "../C-input/cInput";
import { CButton } from "../C-button/cButton";
import { CText } from '../C-text/cText';
import { Viewport } from "../Three-Viewport/viewport";

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
        downloadableError: false,
        fileError: null
    })
    const [uploadFile, setUploadFile] = useState(null)
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

    /////////////////////////////////////////////////////////////////////// LOGIC
    // Change document title
    useEffect(() => {
        document.title = "Welcome";
    }, [])
    useEffect(() => {
        console.log(uploadFile);
    }, [uploadData])

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
                        file
                            ? (
                                setRegisterAvatar(file),
                                reader.onload = (event) => {
                                    setAvatarPreview(event.target.result)
                                    setRegisterData((prevState) => ({
                                        ...prevState,
                                        avatar: file.name
                                    }))
                                },
                                reader.readAsDataURL(file)
                            ) : null
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
                                newFileName = `${rdxUser.credentials.userTokenData.userName}-${file.name}`,
                                newFile = new File([file], newFileName, { type: file.type }),
                                setUploadFile(newFile),
                                setUploadFileUrl(URL.createObjectURL(newFile)),
                                console.log('Setting up reader.onload'),
                                reader.onload = (event) => {
                                    console.log('onload fired');
                                    const base64String = event.target.result.split(',')[1];
                                    const binaryString = window.atob(base64String);
                                    const len = binaryString.length;
                                    const bytes = new Uint8Array(len);
                                    for (let i = 0; i < len; i++) {
                                        bytes[i] = binaryString.charCodeAt(i);
                                    }
                                    setUploadData((prevState) => ({
                                        ...prevState,
                                        file: bytes
                                    }))
                                },
                                console.log('Calling readAsDataURL'),
                                reader.readAsDataURL(file)
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
        }

        allErrorsCleared ? setErrorMsg("") : null
    }, [loginDataError, registerDataError])

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
            if (!fetched.success) {
                throw new Error(fetched.message)
            }
            dispatch(logout({ credentials: {} }))
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }

    /////////////////////////////////////////////////////////////////////// REGISTER

    // Register Call
    const registerInput = async () => {
        try {
            const Uploaded = await uploadAvatarService(registerAvatar)
            if (!Uploaded.success) {
                setErrorMsg(Uploaded.message)
                setTimeout(() => {
                    setErrorMsg("")
                }, 2000);
                throw new Error(Uploaded.error)
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
        navigate('/profile')
    }

    /////////////////////////////////////////////////////////////////////// UPLOAD

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
                    descriptionError: "",
                    downloadableError: false,
                    fileError: null
                }),
                setUploadFile(null),
                setUploadFileUrl(null),
                setResetViewport(true),
                setShowUpload(true)
            )
    }

    /////////////////////////////////////////////////////////////////////// RETURN

    return (
        <div className="header-design">
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
                                                disabled={errorMsg === "" ? false : errorMsg === uploadDataError.nameError ? false : true}
                                                name={'name'}
                                                type={'text'}
                                                value={uploadData.name || ""}
                                                placeholder={'input name'}
                                                onChange={(e) => inputHandler(e)}
                                                onBlur={(e) => checkError(e)}
                                            />
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
                                            <div className="login-button">
                                                <CButton className={errorMsg === "" ? 'button-loggin' : 'loggin-disabled'} title={'login'} />
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
                                        <div className="login-info">
                                            <CInput
                                                disabled={errorMsg === "" ? false : errorMsg === loginDataError.emailError ? false : true}
                                                name={'email'}
                                                type={'text'}
                                                value={loginData.email || ""}
                                                placeholder={'input email'}
                                                onChange={(e) => inputHandler(e)}
                                                onBlur={(e) => checkError(e)}
                                            />
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
                                                <CInput
                                                    disabled={errorMsg === "" ? false : errorMsg === registerDataError.nameError ? false : true}
                                                    name={'name'}
                                                    type={'text'}
                                                    value={registerData.name || ""}
                                                    placeholder={'input name'}
                                                    onChange={(e) => inputHandler(e)}
                                                    onBlur={(e) => checkError(e)}
                                                />
                                                <CInput
                                                    disabled={errorMsg === "" ? false : errorMsg === registerDataError.emailError ? false : true}
                                                    name={'email'}
                                                    type={'text'}
                                                    value={registerData.email || ""}
                                                    placeholder={'input email'}
                                                    onChange={(e) => inputHandler(e)}
                                                    onBlur={(e) => checkError(e)}
                                                />
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