const USERS = []

export const getUserByLogin = async (username) => {
    const user = USERS.find(user => user.login === username)

    return user
}

export const create = async (login, role, passwordHash) => {
    let newUser = { 
        id: USERS.length + 1, 
        login: login, 
        role: role, 
        passwordHash: passwordHash, 
        password_hash: passwordHash, 
    }

    USERS.push(newUser)

    return newUser
}

export const getRoleByUserId = async (decodedId) => {
    const user = USERS.find(user => user.id === decodedId)
    return user.role
}
