// Styles
import './profile.css'

// Lucide

// Methods/Modules
import { useState, useEffect } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { userData } from "../../app/slices/userSlice";

// Api Calls
import { getAvatarService, getOwnProfileService } from '../../services/apiCalls';

// Custom Methods

// Custom Elements
import { CCard } from "../../common/C-card/cCard"
import { CText } from "../../common/C-text/cText";




export const Profile = () => {
    /////////////////////////////////////////////////////////////////////// INSTANCES
    const rdxUser = useSelector(userData)
    const userToken = rdxUser.credentials.userToken

    /////////////////////////////////////////////////////////////////////// HOOKS
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    /////////////////////////////////////////////////////////////////////// LOGIC

    // Change document title
    useEffect(() => {
        !rdxUser?.credentials?.userToken
            ? navigate('/')
            : (document.title = `${rdxUser?.credentials?.userTokenData?.userName}'s Profile`)
    }, [])

    useEffect(() => {
        const getProfile = async () => {
            try {
                const userFetched = await getOwnProfileService(userToken)
                if (!userFetched.success) {
                    throw new Error(userFetched.message)
                }
                if (!userFetched.data.avatar.split(":")[0] === 'https') {
                    const avatarFetched = await getAvatarService(userToken, userFetched.data.avatar)
                    console.log(avatarFetched);
                }
                setUserInfo(userFetched.data)
                setLoading(false)
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

    /////////////////////////////////////////////////////////////////////// RETURN
    // console.log(userInfo)

    return (
        <div className="profile-design">
            <div className="user-card">
                {
                    loading
                        ? ('loading')
                        : (
                            <CCard>
                                <div className="profileAvatar">
                                    <img src={userInfo.avatar} alt="" />
                                </div>
                                <CText title={userInfo.name} />
                                <CText title={userInfo.bio} />
                                <CText title={userInfo.bio} />
                            </CCard>
                        )
                }
            </div>
            <div className="uploads-card">
                {
                    loading
                        ? ('loading')
                        : (
                            <CCard>
                                {/* <img src={userInfo.avatar} alt="" />
                                <CText title={userInfo.name} />
                                <CText title={userInfo.bio} />
                                <CText title={userInfo.bio} /> */}
                            </CCard>
                        )
                }
            </div>
            <div className="posts-card">
                {
                    loading
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