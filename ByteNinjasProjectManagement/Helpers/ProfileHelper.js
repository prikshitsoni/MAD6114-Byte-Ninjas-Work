
import { firebase, currentUser } from "../Firebase/config";

class User {
    constructor( email = '',firstName = '', lastName = '',  hourlyRate = '', position = '') {
        this.email  = currentUser.email,
        this.firstName = firstName;
        this.lastName = lastName;
        this.hourlyRate = hourlyRate;
        this.position = position;
    }
}
const dataConverter = {
    toFirebase: (User) => {
        return {
            firstName: User.firstName,
            hourlyRate: User.hourlyRate,
            lastName: User.lastName,
            position: User.position,
            email: currentUser.email
        };
    } ,
    fromFirebase: (snapshot) => {
        const data = snapshot.data();
        return new User(snapshot.email, data.firstName, data.lastName, data.position, data.hourlyRate);
    },
};


const saveUser = (User,updatecomplete)  => {
    const firebaseuser = dataConverter.toFirebase(User);
    console.log(firebaseuser);
         firebase.firestore().collection("users").doc(currentUser.email).set( User).then (()=> updatecomplete
         (User).catch((error => console.log(error))))

    //             firstName: User.firstName,
    //     lastName: "Aulakbbbh",
    //     hourlyRate : 120,
    //   position: "HUaai"}).then(()=> 
    //    {
    //         console.log("h");
    //         console.log(User);
};

const getUser = (userId, callback) => {
    const unsubscribe = firebase.firestore().collection('users').doc(currentUser.email).onSnapshot((document) => {
        let data = document.data();
        let user = new User(document.email, data.firstName, data.lastName, data.hourlyRate, data.position);

        callback(user);
    });

    return unsubscribe;
}
//    const getuser = (docx) =>
//    {
//     //   var user = []
//       const doc =   firebase.firestore().collection("users").doc(currentUser.email).get();


//     return doc;
    
// };

export {  saveUser,getUser,User };