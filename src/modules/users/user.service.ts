const registerUserToDB = async (payload: any) => {
    const { id, name, email, password, phone, role, status, address, createdAt, updateAt } = payload;
    return payload;
}


export const userService = {
    registerUserToDB
}