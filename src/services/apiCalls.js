

export const root = 'http://localhost:4000/api'


/// AUTH
export const loginService = async (loginData) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify(loginData)
        }
        const response = await fetch(`${root}/auth/login`, options)
        const data = await response.json()

        if (!data.success) {
            throw new Error(data.error)
        }

        return data
    } catch (error) {
        return error
    }
}
export const logoutService = async (token) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
        const response = await fetch(`${root}/auth/logout`, options)
        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}
export const registerService = async (registerData) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify(registerData)
        }
        const response = await fetch(`${root}/auth/register`, options)
        const data = await response.json()

        if (!data.success) {
            throw new Error(data.error)
        }

        return data
    } catch (error) {
        return error
    }
}
export const uploadAvatarService = async (file) => {
    try {
        const formData = new FormData()
        formData.append("avatar", file)
        const options = {
            method: 'POST',
            body: formData
        }
        const response = await fetch(`${root}/file/avatar`, options)
        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}



/// UPLOAD

export const createNewUpload = async (token, uploadData) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify(uploadData)
        }
        const response = await fetch(`${root}/upload/upload`, options)

        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}
export const uploadModelService = async (token, uploadFile) => {
    try {
        const formData = new FormData()
        formData.append("uploadFile", uploadFile)
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        }
        const response = await fetch(`${root}/file/upload`, options)
        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}
export const getAllUploadsService = async () => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/octet-binary'
            }
        }
        const response = await fetch(`${root}/upload/all`, options)
        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}
export const getUploadFileService = async (uploadId) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/octet-binary'
            }
        }

        const response = await fetch(`${root}/file/download/${uploadId}`, options)

        if (!response.ok) {
            throw new Error(response)
        }

        const blob = await response.blob()

        return blob
    } catch (error) {
        return error
    }
}
export const deleteOwnUploadService = async (token, uploadId) => {
    try {
        const options = {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${token}`
            },
        }

        const response = await fetch(`${root}/upload/delete/${uploadId}`, options)

        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}



/// USER

export const getAvatarService = async (filename, token) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const response = await fetch(`${root}/file/avatar/${filename}`, options)
        if (!response.ok) {
            throw new Error('Network response was not ok:', response.statusText)
        }
        const blob = await response.blob()

        const url = window.URL.createObjectURL(blob)

        return url
    } catch (error) {
        console.error('Error fetching avatar:', error);
        return error;
    }
}
export const getOwnProfileService = async (token) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const response = await fetch(`${root}/user/profile/`, options)
        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}
export const getProfileByIdService = async (token, userId) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const response = await fetch(`${root}/user/profile/${userId}`, options)
        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}
export const updateOwnProfileService = async (token, updateData) => {
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        }
        const response = await fetch(`${root}/user/profile/update`, options)

        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}
export const deleteOwnProfileService = async (token) => {
    try {
        const options = {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${token}`
            },
        }

        const response = await fetch(`${root}/user/delete`, options)

        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}
export const likeDislikeService = async (token,uploadId)=>{
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        }
        const response = await fetch(`${root}/user/like/${uploadId}`, options)

        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}
export const followUnfollowService = async(token,userId)=>{
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        }
        const response = await fetch(`${root}/user/follow/${userId}`, options)

        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}


// UPLOAD COMMENTS

export const createUploadCommentService = async (uploadId, commentData, token) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
        }
        console.log(options);
        const response = await fetch(`${root}/comment/upload/new/${uploadId}`, options)

        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}
export const deleteUploadCommentService = async (commentId, token) => {
    try {
        const options = {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${token}`
            },
        }
        const response = await fetch(`${root}/comment/upload/delete/${commentId}}`, options)

        const data = await response.json()

        if (!data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        return error
    }
}

