import './superadmin.css'

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { userData, login, logout } from "../../app/slices/userSlice";

import { deleteUserBySuperadmin, getAllUsersBySuperadminService } from '../../services/apiCalls';

import { X, Check } from "lucide-react";

import { CButton } from "../../common/C-button/cButton";

export const Superadmin = () => {

    const rdxUser = useSelector(userData)
    const userToken = rdxUser?.credentials?.userToken

    const [allUsers, setAllUsers] = useState(null)
    const [page, setPage] = useState(1)
    const [showDelete, setShowDelete] = useState(true)
    const [showConfirm, setShowConfirm] = useState(false)


    useEffect(() => {
        document.title = `Superadmin utilities`
    }, [])

    useEffect(() => {
        if (!allUsers) {
            const getAllUsers = async () => {
                try {
                    const fetched = await getAllUsersBySuperadminService(userToken, page)
                    if (!fetched.success) {
                        throw new Error(fetched.message)
                    }
                    setAllUsers(fetched.data)
                } catch (error) {
                    if (error === "TOKEN NOT FOUND" || error === "TOKEN INVALID" || error === "TOKEN ERROR") {
                        dispatch(logout({ credentials: {} }));
                    } else {
                        console.log(error);
                    }
                }
            }
            getAllUsers()
        }
    }, [allUsers])

    const toggleDelete = () => {
        setShowDelete(prevState => !prevState)
        setShowConfirm(prevState => !prevState)
    }

    const toggleConfirm = () => {
        setShowConfirm(prevState => !prevState)
        setShowDelete(prevState => !prevState)
    }

    const deleteUserById = async (index) => {
        try {
            const fetched = await deleteUserBySuperadmin(userToken, allUsers[index].id)
            if (!fetched.success) {
                throw new Error(fetched.message)
            }
            setAllUsers(fetched.data)
        } catch (error) {
            if (error === "TOKEN NOT FOUND" || error === "TOKEN INVALID" || error === "TOKEN ERROR") {
                dispatch(logout({ credentials: {} }));
            } else {
                console.log(error);
            }
        }
    }


    return (
        <div className="superadmin-design">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>avatar</th>
                        <th>uploads</th>
                        <th>delete</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers && allUsers.map((user, index) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.avatar}</td>
                            <td>{user.uploads.length}</td>
                            <td>
                                {
                                    showDelete && !showConfirm
                                        ? <X onClick={() => toggleDelete()} />
                                        : <div className="confirm">
                                            delete user?
                                            <X onClick={() => toggleConfirm()} />
                                            <Check onClick={() => deleteUserById(index)} />
                                        </div>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}