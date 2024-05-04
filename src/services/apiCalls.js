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

        if (data.success) {
            throw new Error(data.message)
        }

        return data
    } catch (error) {
       console.log(error);
    }
}