const root = 'http://localhost:4000/api'

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
            body: JSON.stringify(loginData)
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