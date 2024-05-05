// Styles
import './header.css'

// Lucide
import { X } from "lucide-react";

// Methods/Modules
import { useState, useEffect } from "react";
import { decodeToken } from "react-jwt";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { userData, login, logout } from "../../app/slices/userSlice";

// Api Calls
import { loginService, registerService } from '../../services/apiCalls';

// Custom Methods
import { validate } from "../../utils/validator";

// Custom Elements
import { Navigator } from "../navigator/navigator";
import { CCard } from "../C-card/cCard";
import { CInput } from "../C-input/cInput";
import { CButton } from "../C-button/cButton";
import { CText } from '../C-text/cText';




export const Header = () => {

    /////// INSTANCES
    const dispatch = useDispatch()
    const rdxUser = useSelector(userData)
    const reader = new FileReader()
    let file

    ////// HOOKS
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")


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

    /////// LOGIC

    // Change document title
    useEffect(() => {
        document.title = "Welcome";
    }, [])

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
                                setAvatarPreview(file),
                                setRegisterData((prevState) => ({
                                    ...prevState,
                                    avatar: file.name
                                })),
                                reader.onload = (event) => {
                                    setRegisterAvatar(event.target.result)
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

    /////// LOGIN
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
            }

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


    /////// REGISTER
    // Register Call
    const registerInput = async () => {
        try {
            const fetchedInfo = await registerService(registerData)
            if (!fetchedInfo.success) {
                setErrorMsg(fetchedInfo.message)
                setTimeout(() => {
                    setErrorMsg("")
                }, 2000);
                throw new Error(fetchedInfo.message)
            }
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
                }))
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
    }

    return (
        <div className="header-design">
            <div className="separator-header"></div>
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
                    <form
                        action="http://localhost:4000/api/file/avatar"
                        encType="multipart/form-data"
                        method="post"
                    >
                        <div className="closeCard"><X onClick={() => toggleRegister()} className='icon-closeCard' /></div>
                        <div className="register-inputs">
                            <div className="register-info">
                                <CInput
                                    disabled={errorMsg === "" ? false : errorMsg === registerDataError.avatarError ? false : true}
                                    name={'avatar'}
                                    type={'file'}
                                    value={registerData.avatar || ""}
                                    placeholder={'input avatar'}
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
                            <CButton className={errorMsg === "" ? 'button-register' : 'register-disabled'} title={'register'} />
                            <CText title={errorMsg} />
                        </div>
                    </form>
                </CCard>
            </div>
        </div>
    )
}