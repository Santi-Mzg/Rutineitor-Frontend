import { redirect } from "react-router-dom";
import { deleteUserRequest, fetchUserRequest, fetchUsersRequest } from "../../api/user"
import { UserType } from "../definitions";

export const fetchUser = async (username: string) => {
    let user: UserType = {
        id: '',
        username: '',
        email: '',
        age: '',
        weight: '',
        height: '',
        goal: '',
        isTrainer: false
    }

    try {
        const res = await fetchUserRequest(username)
        user = res.data || {};
        console.log("AJAAAAAAAA"+JSON.stringify(res.data))

    } catch (error) {
        console.log(error)
    }

    return user
}

export const fetchUsers = async () => {
    let users: UserType[] = []
    try {
        const res = await fetchUsersRequest()
        users = Array.isArray(res.data) ? res.data : [];
        console.log(JSON.stringify(users))

    } catch (error) {
        console.log(error)
    }

    return users
}

export const deleteUser = async (id: string) => {
    try {
        const res = await deleteUserRequest(id)
                
    } catch (error) {
        console.log(error)
    }

    redirect('/usuarios')
}
