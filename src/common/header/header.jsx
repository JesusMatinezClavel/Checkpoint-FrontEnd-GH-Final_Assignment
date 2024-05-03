// Styles
import './header.css'

// Methods/Modules
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { validate } from "../../utils/validator";

// Custom Elements
import { Navigator } from "../navigator/navigator";
import { CCard } from "../C-card/cCard";
import { CInput } from "../C-input/cInput";
import { CButton } from "../C-button/cButton";
import { CText } from '../C-text/cText';




export const Header = () => {

    // INSTANCES
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    // HOOKS
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

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })
    const [loginDataError, setLoginDataError] = useState({
        emailError: "",
        passwordError: ""
    })

    const [errorMsg, setErrorMsg] = useState("")

    // LOGIC
    useEffect(() => {
        document.title = "Welcome";
    }, [])

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
                setRegisterData((prevState) => ({
                    ...prevState,
                    [e.target.name]: e.target.value
                }))
            )
            : null

        if (e.target.value === "") {
            setErrorMsg("")
        }

    }

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

    console.log(loginDataError);
    console.log(errorMsg);

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

    const toggleLogin = () => {
        setShowRegister(false)
        showLogin
            ? setShowLogin(false)
            : setShowLogin(true)
    }

    const toggleRegister = () => {
        setShowLogin(false)
        showRegister
            ? setShowRegister(false)
            : setShowRegister(true)
    }

    return (
        <div className="header-design">
            <div className="separator-header"></div>
            <CButton className={'button-loggin'} title={'login'} onClick={() => toggleLogin()} />
            <CButton className={'button-register'} title={'register'} onClick={() => toggleRegister()} />

            {/* Loggin Card */}
            <CCard className={showLogin ? "card-login" : 'hidden'}>
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
                    type={'text'}
                    value={loginData.password || ""}
                    placeholder={'input password'}
                    onChange={(e) => inputHandler(e)}
                    onBlur={(e) => checkError(e)}
                />
                <CButton className={errorMsg === "" ? 'button-loggin' : 'loggin-disabled'} title={'login'} />
                <CText title={errorMsg} />
            </CCard>

            {/* Register Card */}
            <CCard className={showRegister ? "card-register" : 'hidden'}>
                <div className="register-inputs">
                    <CInput
                        disabled={errorMsg === "" ? false : errorMsg === registerDataError.avatarError ? false : true}
                        name={'avatar'}
                        type={'file'}
                        value={registerData.avatar || ""}
                        placeholder={'input avatar'}
                        onChange={(e) => inputHandler(e)}
                        onBlur={(e) => checkError(e)}
                    />
                    <div className="register-info">
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
                            type={'text'}
                            value={registerData.password || ""}
                            placeholder={'input password'}
                            onChange={(e) => inputHandler(e)}
                            onBlur={(e) => checkError(e)}
                        />
                    </div>
                </div>
                <CButton className={errorMsg === "" ? 'button-register' : 'register-disabled'} title={'register'} />
                <CText title={errorMsg} />
            </CCard>
        </div>
    )
}