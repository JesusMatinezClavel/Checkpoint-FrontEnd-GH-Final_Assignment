

export const root = 'http://localhost:4000/api'

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
