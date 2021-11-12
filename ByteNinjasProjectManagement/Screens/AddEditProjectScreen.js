import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert, ScrollView } from 'react-native';

import palette from 'google-material-color-palette-json';
import {Card} from 'react-native-shadow-cards';
import CustomButton from '../Components/CustomButton';
import CustomActivityIndicator from '../Components/CustomActivityIndicator';
import { currentUser } from '../Firebase/config';
import { addProject, getProject, updateProject, Project } from '../Helpers/ProjecstHelper';

export default function AddEditProjectScreen({route, navigation}) {
    const { projectId } = route.params;

    const mProject = useRef(new Project());
    const [isLoading, setIsLoading] = useState(false);
    // const [state, setState] = useState({
    //     'project': new Project(),
    //     'statusText': '',
    //     'isComplete': false,
    // });
    const [project, setProject] = useState(new Project());
    const [statusText, setStatusText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    // Methods
    const getStatusText = (project) => {
        let localStatusText = getIsComplete(project) ? 'Complete' : 'In Progress';
        return localStatusText;
    }

    const getIsComplete = (project) => {
        let localIsComplete = (project.tasksCompleted === project.tasks.length) &&
            (project.tasks.length !== 0);
        return localIsComplete;
    }

    const updateProjectState = (key, value) => {
        // const localState = {...state};
        const proj = {...mProject.current};
        proj[key] = value;

        setProject(proj);
        mProject.current = {...proj};
        // setState(localState);
    }

    const doneCallbackFromMembers = (members) => {
        let localEmails = members.map(m => m.email);
        let localProject = {...mProject.current};

        localProject.members = localEmails;
        setProject(localProject);
        mProject.current = {...localProject};

        navigation.goBack();
    };

    const donecallbackFromTasks = (tasks) => {
        console.log('in done callback from tasks');
        console.log(tasks);
        let taskIds = tasks.map(t => t.id);
        let localProject = {...mProject.current};

        localProject.tasks = taskIds;
        setProject(localProject);
        mProject.current = {...localProject};

        navigation.goBack();
    }

    const onSavePressed = async () => {
        // Validate Fields
        console.log(currentUser.email);
        setIsLoading(true);

        try {
            if (projectId) {
                await updateProject(projectId, mProject.current);
            } else {
                await addProject(mProject.current);
            }

            setIsLoading(false);
            Alert.alert("Success!", "Saved", 
            [
                { 
                    text: 'OK',
                    onPress: () => { navigation.navigate('My Projects') },
                },
            ]);
        } catch(error) {
            console.log(error);
            setIsLoading(false);
            Alert.alert("Error", "Unable to save project.");
        }
    }

    // Navigation
    const navigateToMembersScreen = () => {
        navigation.navigate('Members', { 'project': mProject.current, 'doneCallback': doneCallbackFromMembers });
    };

    const navigateToTasksScreen = () => {
        console.log('in navigate');
        navigation.navigate('Tasks', { 'project': mProject.current, 'doneCallback':  donecallbackFromTasks });
    };

    // Lifecycles
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title='Save' color='#fff' onPress={() => onSavePressed()}/>
                // <Image source={require('../assets/byte-ninja.png')} style={{width: 20, height: 20, marginRight: 5,}}></Image>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        if (!projectId) {
            return;
        }

        let unsubScribe = getProject(projectId, (project) => {
            // const localState = { ...state };
            const localProject = {...project}; // Copy
            const isComplete = getIsComplete(localProject);
            const statusText = getStatusText(localProject);

            setProject(localProject);
            mProject.current = {...localProject};

            setIsComplete(isComplete);
            setStatusText(statusText);
        });

        // Unsubscribe when component will unmount to prevent memory leak
        return () => { unsubScribe() };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            { isLoading && <CustomActivityIndicator /> }

            <Text style={[styles.label, {marginTop: 2}]}>Project Name:</Text>
            <TextInput style={styles.textInput} placeholder='Enter Project Name' value={project.name} onChangeText={(textValue) => updateProjectState('name', textValue)}/>

            <Text style={styles.label}>Project Description:</Text>
            <TextInput multiline={true} numberOfLines={5} style={styles.multiLineInput} placeholder='Enter Project Description' value={project.description} onChangeText={(textValue) => updateProjectState('description', textValue)}/>

            <Text style={[styles.label, {marginTop: 25,}]}>Members (count: {project.members.length})</Text>
            <TouchableOpacity style={styles.listItem} onPress={() => navigateToMembersScreen()}>
                <Card style={styles.card}>
                    <Text style={styles.text}>View / Add Members</Text>
                    <Text style={styles.text}>{'>'}</Text>
                </Card>
            </TouchableOpacity>

            <Text style={styles.label}>Tasks (count: {project.tasks.length})</Text>
            <TouchableOpacity style={styles.listItem} onPress={() => navigateToTasksScreen()}>
                <Card style={styles.card}>
                    <Text style={styles.text}>View / Add Tasks</Text>
                    <Text style={styles.text}>{'>'}</Text>
                </Card>
            </TouchableOpacity>

            <Text style={[styles.label, {marginTop: 25,}]}>Status: {statusText}</Text>

            {   isComplete &&
                <Text style={styles.label}>Cost:</Text>
            }

            <CustomButton style={styles.saveButton} title='Save' onPress={() => onSavePressed()}/>
            <StatusBar style="auto" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingBottom: 50,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        width: '100%',
    },
    label: {
        fontSize: 20,
        fontWeight: '500',
        paddingTop: 15, 
        paddingBottom: 10,
        paddingLeft: 10, 
        paddingRight: 10,
        marginTop: 10,
        color: palette.grey.shade_800,
    },
    text: {
        fontSize: 18,
        fontWeight: '400',
        paddingTop: 10, 
        paddingBottom: 10,
        paddingLeft: 10, 
        paddingRight: 10,
        color: 'darkslateblue',
    },
    textInput: {
        fontSize: 18,
        color: palette.grey.shade_900,
        padding: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d3d3d3',
        width: '100%',
    },
    multiLineInput: {
        fontSize: 18,
        color: palette.grey.shade_900,
        padding: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d3d3d3',
        width: '100%',
        height: 150,
    },
    card: {
        elevation: 1,
        padding: 15,
        width: '100%',
        borderRadius: 12,
        shadowOffset: {width: 1, height: 1},
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listItem: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 8,
        paddingBottom: 8,
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        width: '100%',
        marginTop: 40,
    }
});