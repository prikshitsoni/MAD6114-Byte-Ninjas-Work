import { firebase, currentUser } from "../Firebase/config";
import { getUser } from "./UsersHelper";

/*
{
    "id": "someTaskId", // Auto-generated
    "name": "Complete Login",
    "description": "Create Login page for user",
    "startDate": 8392832932327, // Timestamp
    "endDate": 0,
    "hours": 0,
    "cost": 0,
    "status": "Pending", // Pending, In Progress, Complete
    "preRequisites": [taskId1, taskId2],
    "assignedUser": "mukhtar@gmail.com",
}
 */

class Task {
    constructor(id = '', name = '', description = '', startDate = 0, endDate = 0, hours = 0, cost = 0, status = 'Pending', preRequisites = [], assignedUser = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.hours = hours;
        this.cost = cost;
        this.status = status;
        this.preRequisites = preRequisites;
        this.assignedUser = assignedUser;
    }
}

const taskConverter = {
    toFirebase: (task) => {
        return {
            name: task.name,
            description: task.description,
            startDate: task.startDate,
            endDate: task.endDate,
            hours: task.hours,
            cost: task.cost,
            status: task.status,
            preRequisites: task.preRequisites,
            assignedUser: task.assignedUser.email,
        }
    },
    fromFirebase: (snapshot) => {
        const data = snapshot.data();
        return new Task(snapshot.id, data.name, data.description, data.startDate, data.endDate, data.hours, data.cost, data.status, data.preRequisites);
    },
}

const getTasks = (taskIds) => {
    console.log('task ids');
    console.log(taskIds);
    const promise = new Promise( async (resolve, reject) => {
        try {
            let tasks = [];
            let assignedUserEmails = [];

            const querySnapshot = await firebase.firestore().collection('tasks')
                .where(firebase.firestore.FieldPath.documentId(), 'in', taskIds).get();
            
            querySnapshot.forEach((document) => {
                // let data = document.data();
                // let assignedUser = await getUser(data.assignedUser);

                let task = taskConverter.fromFirebase(document);
                // task.assignedUser = assignedUser;
                tasks.push(task);
                assignedUserEmails.push(document.data().assignedUser);
            });

            for (let i = 0; i < tasks.length; i++) {
                let task = tasks[i];
                let userEmail = assignedUserEmails[i];

                let assignedUser = await getUser(userEmail);
                task.assignedUser = assignedUser;
            }

            console.log('in helper');
            console.log(tasks);
            resolve(tasks);
        } catch (error) {
            reject(error);
        }
    });

    return promise;
};

const getTask = (taskId, callback) => {
    const unsubscribe = firebase.firestore().collection('tasks').doc(taskId).onSnapshot(async (document) => {
        let data = document.data();
        let assignedUser = await getUser(data.assignedUser);

        let task = taskConverter.fromFirebase(document);
        task.assignedUser = assignedUser;

        callback(task);
    });
};

const addTask = (task) => {
    task.startDate = new Date().valueOf();

    const firebaseTask = taskConverter.toFirebase(task);

    const promise = new Promise(async (resolve, reject) => {
        try {
            const response = await firebase.firestore().collection('tasks').add(firebaseTask);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

    return promise;
}

const updateTask = (taskId, task) => {
    const firebaseTask = taskConverter.toFirebase(task);

    const promise = new Promise(async (resolve, reject) => {
        try {
            const response = await firebase.firestore().collection('tasks').doc(taskId).update(firebaseTask);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

    return promise;
}

export { Task, getTask, getTasks, addTask, updateTask };