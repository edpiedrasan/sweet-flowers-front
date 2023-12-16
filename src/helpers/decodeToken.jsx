import jwt from 'jwt-decode' // import dependency

export const getNamePerson = () => {
    const decoded = localStorage.getItem('token');
    try {
        // debugger;
        let {user} = jwt(decoded)
        // const { token } = jwt(decoded);
        if (Object.keys(user).length) {
            // const { routes } = decoded;
            return user.nameEmployee;
        }
        return "";
    } catch (err) {
        return "";
    }
};

export const getEmailPerson = () => {
    const decoded = localStorage.getItem('token');
    try {
        // debugger;
        let {user} = jwt(decoded)
        // const { token } = jwt(decoded);
        if (Object.keys(user).length) {
            // const { routes } = decoded;
            return user.email;
        }
        return "";
    } catch (err) {
        return "";
    }
};

export const getUserPerson = () => {
    const decoded = localStorage.getItem('token');
    try {
        // debugger;
        let {user} = jwt(decoded)
        // const { token } = jwt(decoded);
        if (Object.keys(user).length) {
            // const { routes } = decoded;
            return user.user;
        }
        return "";
    } catch (err) {
        return "";
    }
};

export const getOcupationPerson = () => {
    const decoded = localStorage.getItem('token');
    try {
        // debugger;
        let {user} = jwt(decoded)
        // const { token } = jwt(decoded);
        if (Object.keys(user).length) {
            // const { routes } = decoded;
            return user.idOcupation;
        }
        return "";
    } catch (err) {
        return "";
    }
};