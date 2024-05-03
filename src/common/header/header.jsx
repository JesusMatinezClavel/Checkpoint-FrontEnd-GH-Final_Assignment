// Styles
import './header.css'

// Methods/Modules
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Custom Elements
import { Navigator } from "../navigator/navigator";
import { CCard } from "../C-card/cCard";
import { CInput } from "../C-input/cInput";
import { CButton } from "../C-button/cButton";




export const Header = () => {

    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    const [registerData, setRegisterData] = useState({
        avatar: "",
        name: "",
        email: "",
        password: ""
    })

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })

    console.log(loginData);
    console.log(registerData);


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

    }

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
                    name={'email'}
                    type={'text'}
                    value={loginData.email || ""}
                    onChange={(e) => inputHandler(e)}
                    placeholder={'input email'}
                />
                <CInput
                    name={'password'}
                    type={'text'}
                    value={loginData.password || ""}
                    onChange={(e) => inputHandler(e)}
                    placeholder={'input password'}
                />
                <CButton className={'button-loggin'} title={'login'} />
            </CCard>

            {/* Register Card */}
            <CCard className={showRegister ? "card-register" : 'hidden'}>
                <div className="register-inputs">
                    <CInput
                        name={'avatar'}
                        type={'file'}
                        value={registerData.avatar || ""}
                        placeholder={'input avatar'}
                        onChange={(e) => inputHandler(e)}
                    />
                    <div className="register-info">
                        <CInput
                            name={'name'}
                            type={'text'}
                            value={registerData.name || ""}
                            placeholder={'input name'}
                            onChange={(e) => inputHandler(e)}
                        />
                        <CInput
                            name={'email'}
                            type={'text'}
                            value={registerData.email || ""}
                            placeholder={'input email'}
                            onChange={(e) => inputHandler(e)}
                        />
                        <CInput
                            name={'password'}
                            type={'text'}
                            value={registerData.password || ""}
                            placeholder={'input password'}
                            onChange={(e) => inputHandler(e)}
                        />
                    </div>
                </div>
                <CButton className={'button-loggin'} title={'register'} />
            </CCard>
        </div>
    )
}