import { firebase, currentUser } from "../Firebase/config";

/*
{
    “id”: “someProjectId”, // Auto generated
    “name”: “Work”,
    “description”: “This is the front-end development project”,
    “tasks”: [“taskId1”, “taskId2”, “taskId3”],
    “members”: [“memberId1”, “memberId2”],
    “tasksCompleted”: 0,
    “totalCost”: 0,
    “createdOn”: 1233353566642, // Timestamp. Not really needed
    “ownerId”: “userId1” // email
	}
 */

class Project {
    constructor(id = '', name = '', description = '', tasks = [], members = [], tasksCompleted = 0, totalCost = 0, createdOn = 0, ownerId = currentUser.email) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tasks = tasks;
        this.members = members;
        this.tasksCompleted = tasksCompleted;
        this.totalCost = totalCost;
        this.createdOn = createdOn;
        this.ownerId = ownerId;
    }
}

const projectConverter = {
    toFirebase: (project) => {
        return {
            name: project.name,
            description: project.description,
            tasks: project.tasks,
            members: project.members,
            tasksCompleted: project.tasksCompleted,
            totalCost: project.totalCost,
            createdOn: project.createdOn,
            ownerId: project.ownerId,
        };
    },
    fromFirebase: (snapshot) => {
        const data = snapshot.data();
        return new Project(snapshot.id, data.name, data.description, data.tasks, data.members, data.tasksCompleted, data.totalCost, data.createdOn, data.ownerId);
    },
};

const getAllProjects = (callback) => {
    const unsubsribe = firebase.firestore().collection('projects').onSnapshot((querySnapshot) => {
        console.log("in on query snapshot");
        let projects = [];
        querySnapshot.forEach((document) => {
            let data = document.data();
            let project = new Project(document.id, data.name, data.description, data.tasks, data.members, data.tasksCompleted, data.totalCost, data.createdOn, data.ownerId);

            projects.push(project);
        });

        callback(projects);
    });

    return unsubsribe;
};

const getProject = (projectId, callback) => {
    const unsubscribe = firebase.firestore().collection('projects').doc(projectId).onSnapshot((document) => {
        let data = document.data();
        let project = new Project(document.id, data.name, data.description, data.tasks, data.members, data.tasksCompleted, data.totalCost, data.createdOn, data.ownerId);

        callback(project);
    });

    return unsubscribe;
}

const addProject = (project) => {
    project.ownerId = currentUser.email;
    project.createdOn = new Date().valueOf();

    const firebaseProject = projectConverter.toFirebase(project);

    const promise = new Promise(async (resolve, reject) => {
        try {
            const response = await firebase.firestore().collection('projects').add(firebaseProject);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    })

    return promise;
};

const updateProject = (projectId, project) => {
    const firebaseProject = projectConverter.toFirebase(project);

    const promise = new Promise(async (resolve, reject) => {
        try {
            const response = await firebase.firestore().collection('projects').doc(projectId).update(firebaseProject);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    })

    return promise;
}

export { addProject, updateProject, getAllProjects, getProject, projectConverter, Project };