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
                    placeholder={'input email'}
                />
                <CInput
                    name={'password'}
                    placeholder={'input password'}
                />
                <CButton className={'button-loggin'} title={'login'} />
            </CCard>

            {/* Register Card */}
            <CCard className={showRegister ? "card-register" : 'hidden'}>
                <div className="register-avatar">
                    <CInput
                        name={'avatar'}
                        type={'file'}
                        placeholder={'input avatar'}
                    />
                </div>
                <div className="register-info">
                    <CInput
                        name={'name'}
                        type={'text'}
                        placeholder={'input name'}
                    />
                    <CInput
                        name={'birthdate'}
                        type={'date'}
                        placeholder={'input birthdate'}
                    />
                    <CInput
                        name={'email'}
                        type={'text'}
                        placeholder={'input email'}
                    />
                    <CInput
                        name={'password'}
                        type={'text'}
                        placeholder={'input password'}
                    />
                <CButton className={'button-loggin'} title={'login'} />
                </div>
            </CCard>
        </div>
    )
}