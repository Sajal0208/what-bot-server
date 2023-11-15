import jwt from 'jsonwebtoken'

//sign and make a new token for the user
const getToken = (email: string, expirationTime: number) => {
    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET!,
        {
            expiresIn: expirationTime //2h in seconds
        }
    )

    return token
}

export { getToken }