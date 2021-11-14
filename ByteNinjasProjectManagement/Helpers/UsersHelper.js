import { firebase, currentUser } from "../Firebase/config";

/*
{
    "id": "someUserId", // Auto-generated
    "firstName": "Mukhtar",
    "lastName": "Yusuf",
    "email": "mukhtar@gmail.com",
    "hourlyRate": 57
}
 */

class User {
    constructor(id = '', firstName = '', lastName = '', email = '', hourlyRate = 0) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hourlyRate = hourlyRate;
    }
}

const userConverter = {
    toFirebase: (user) => {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            hourlyRate: user.hourlyRate,
        }
    },
    fromFirebase: (snapshot) => {
        const data = snapshot.data();
        return new User(snapshot.id, data.firstName, data.lastName, data.email, data.hourlyRate);
    },
};

const getAllUsers = (callback) => {
    const unsubscribe = firebase.firestore().collection('users').onSnapshot((querySnapshot) => {
        let users = [];
        querySnapshot.forEach((document) => {
            let data = document.data;
            let user = userConverter.fromFirebase(document);

            users.push(user);
        });

        callback(users);
    });

    return unsubscribe;
};

const getUsers = (userEmails) => {
    const promise = new Promise( async (resolve, reject) => {
        try {
            let users = [];
            const querySnapshot = await firebase.firestore().collection('users').where('email', 'in', userEmails).get();
            // console.log('get users');
            // console.log(data);

            querySnapshot.forEach((document) => {
                let user = userConverter.fromFirebase(document);
                users.push(user);
            });

            resolve(users);
        } catch(error) {
            reject(error);
        }
    });

    return promise;
};

const getUser = (userId) => {
    const promise = new Promise( async (resolve, reject) => {
        try {
            if (userId === null || userId.length === 0) {
                reject('User id is invalid');
            }
    
            const querySnapshot = await firebase.firestore().collection('users').doc(userId).get();
            
            if (querySnapshot.exists) {
                let user = userConverter.fromFirebase(querySnapshot);
                resolve(user);
            } else {
                reject(new Error('User doesn\'t exist'));
            }
        } catch(error) {
            reject(error);
        }
    });

    return promise;
}

export { User, getUsers, getAllUsers, getUser };