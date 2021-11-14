import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert, ScrollView } from 'react-native';

import palette from 'google-material-color-palette-json';
import {Card} from 'react-native-shadow-cards';
import CustomButton from '../Components/CustomButton';
import CustomActivityIndicator from '../Components/CustomActivityIndicator';
import { currentUser } from '../Firebase/config';

import { Task, addTask, updateTask, getTask } from '../Helpers/TasksHelper';
import MemberListItem from '../Components/MemberListItem';
import { updateProject } from '../Helpers/ProjecstHelper';

export default function AddEditTaskScreen({route, navigation}) {
    // Params
    const { project } = route.params;
    const { taskId } = route.params;
    const { saveCallback } = route.params;

    // Mutable Refs
    const mProject = useRef({...project});
    const mTaskId = useRef(taskId);
    const mTask = useRef(new Task());
    const mUnsubscribe = useRef(null);
    
    // State Variables
    const [isLoading, setIsLoading] = useState(false);
    const [taskIdState, setTaskIdState] = useState(taskId);
    const [task, setTask] = useState(new Task());

    // Methods
    const updateTaskState = (key, value) => {
        const localTask = {...mTask.current};
        localTask[key] = value;

        setTask(localTask);
        mTask.current = {...localTask};
    }

    const doneCallbackFromAssignMember = (member) => {
        const localTask = {...mTask.current};
        localTask.assignedUser = member;

        mTask.current = {...localTask};
        setTask(localTask);

        navigation.goBack();
    };

    const preSaveTask = async () => {
        setIsLoading(true);

        try {
            let document = await addTask(mTask.current);
            
            let localProject = {...mProject.current};
            localProject.tasks.push(document.id);
            await updateProject(localProject.id, localProject);

            setIsLoading(false);

            mTask.current.id = document.id;
            mTaskId.current = document.id;

            console.log('in pre save');
            console.log(mTaskId.current);

            setTaskIdState(document.id);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Error pre-saving task');
        }
    };

    const onSavePressed = async () => {
        // Validate Fields
        setIsLoading(true);

        try {
            if (mTaskId.current !== null && mTaskId.current.length !== 0) {
                await updateTask(mTaskId.current, mTask.current);
            } else {
                let document = await addTask(mTask.current);
                mTask.current.id = document.id;
            }

            setIsLoading(false);
            Alert.alert("Success!", "Saved", 
            [
                { 
                    text: 'OK',
                    onPress: () => { saveCallback(mTask.current) },
                },
            ]);
        } catch(error) {
            console.log(error);
            setIsLoading(false);
            Alert.alert("Error", "Unable to save task.");
        }
    }

    // Navigation
    const navigateToAssignMemberScreen = async () => {
        if (mTaskId.current === null || mTaskId.current.length === 0) {
            await preSaveTask();
        }

        navigation.navigate('Assign Member', { 'task': mTask.current, 'assignedMember': task.assignedUser, 'project': mProject.current, 'doneCallback': doneCallbackFromAssignMember});
    };

    const navigateToSelectPrequisitesScreen = async () => {
        if (mTaskId.current === null || mTaskId.current.length === 0) {
            await preSaveTask();
        }

        navigation.navigate('Select Pre-requisites', { 'task': mTask.current, 'project': mProject.current });
    }

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
        if (!mTaskId.current) {
            return;
        }

        let unsubscribe = getTask(mTaskId.current, (task) => {
            const localTask = {...task};
            setTask(localTask);
            mTask.current = {...localTask};
        });

        mUnsubscribe.current = unsubscribe;
    }, [taskIdState]);

    useEffect(() => {
        return () => { console.log('add edit task unsubscribe'); mUnsubscribe.current(); };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            { isLoading && <CustomActivityIndicator /> }

            <Text style={[styles.label, {marginTop: 2}]}>Task Name:</Text>
            <TextInput style={styles.textInput} placeholder='Enter Task Name' value={task.name} onChangeText={(textValue) => updateTaskState('name', textValue)}/>

            <Text style={styles.label}>Task Description:</Text>
            <TextInput multiline={true} numberOfLines={5} style={styles.multiLineInput} placeholder='Enter Task Description' value={task.description} onChangeText={(textValue) => updateTaskState('description', textValue)}/>

            <Text style={[styles.label, {marginTop: 25,}]}>Assigned Member</Text>
            <TouchableOpacity style={styles.listItem} onPress={() => navigateToAssignMemberScreen()}>
                <Card style={styles.card}>
                    <Text style={styles.text}>Assign Member</Text>
                    <Text style={styles.text}>{'>'}</Text>
                </Card>
            </TouchableOpacity>
            {   task.assignedUser.email  &&
                <MemberListItem member={task.assignedUser} style={styles.memberListItem} />
            }

            <Text style={styles.label}>Prerequisites (count: {task.preRequisites.length})</Text>
            <TouchableOpacity style={styles.listItem} onPress={() => navigateToSelectPrequisitesScreen()}>
                <Card style={styles.card}>
                    <Text style={styles.text}>View / Select Prerequisites</Text>
                    <Text style={styles.text}>{'>'}</Text>
                </Card>
            </TouchableOpacity>

            {
                (task.status === 'complete') &&
                <Text style={[styles.label, {marginTop: 25,}]}>Status: {task.status}</Text>
            }
            {   (task.status === 'Complete') &&
                <Text style={styles.label}>Hours: {task.hours} hrs</Text>
            }
            {
                (task.status === 'Complete') &&
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
    memberListItem: {
        backgroundColor: '#fff',
        paddingLeft: 0,
        paddingRight: 0,
    },
    saveButton: {
        width: '100%',
        marginTop: 40,
    }
});