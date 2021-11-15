import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert, ScrollView } from 'react-native';

import palette from 'google-material-color-palette-json';
import {Card} from 'react-native-shadow-cards';
import { SegmentedControls } from 'react-native-radio-buttons';

import CustomButton from '../Components/CustomButton';
import CustomActivityIndicator from '../Components/CustomActivityIndicator';

import { Task, updateTask, getTask, getTasksNoUsers } from '../Helpers/TasksHelper';
import { getProjectOnce, updateProject } from '../Helpers/ProjecstHelper';

export default function MyTaskDetailsScreen({route, navigation}) {
    // Params
    const { taskId } = route.params;
    const { saveCallback } = route.params;

    // Mutable Refs
    const mPreviousStatus = useRef('');
    const mProject = useRef({});
    const mTaskId = useRef(taskId);
    const mTask = useRef(new Task());
    const mStatusOptions = useRef(['Pending', 'In Progress', 'Complete']);
    const mUnsubscribe = useRef(null);
    
    // State Variables
    const [isLoading, setIsLoading] = useState(false);
    const [task, setTask] = useState(new Task());
    const [startDateText, setStartDateText] = useState('');
    const [endDateText, setEndDateText] = useState('');
    const [statusOptions, setStatusOptions] = useState(['Pending', 'In Progress', 'Complete']);

    // Methods
    const updateTaskState = (key, value) => {
        const localTask = {...mTask.current};
        if (key === 'hours' && value.length !== 0) {
            let numValue = Number(value);
            if (numValue) {
                localTask[key] = numValue;
            }
        } else {
            localTask[key] = value;
        }

        setTask(localTask);
        mTask.current = {...localTask};
    }

    const getDateText = (timestamp) => {
        let date = new Date(timestamp);
        let dateString = date.toLocaleString('en-CA', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });

        return dateString;
    }

    const localUpdateProject = async () => {
        try {
            let localTasks = await getTasksNoUsers(mProject.current.tasks);
            let completed = 0;
            let cost = 0;

            for (let task of localTasks) {
                if (task.status === 'Complete') {
                    completed += 1;
                    cost += task.cost;
                }
            }

            mProject.current.tasksCompleted = completed;
            mProject.current.totalCost = cost;

            console.log('local update project');
            console.log(mProject.current);

            await updateProject(mProject.current.id, mProject.current);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Error updating project progress');
        }
    };

    const validatePrerequisitesComplete = async () => {
        if (mTask.current.preRequisites.length === 0 || mTask.current.status === 'Pending') {
            return true;
        }

        let localTasks = await getTasksNoUsers(mTask.current.preRequisites);
        for (let task of localTasks) {
            if (task.status !== 'Complete') {
                return false;
            }
        }

        return true;
    };

    const onSavePressed = async () => {
        // Validate Fields
        setIsLoading(true);

        let arePrerequisitesComplete = await validatePrerequisitesComplete();
        if (!arePrerequisitesComplete) {
            setIsLoading(false);
            Alert.alert('Error', 'All pre-requisites must be complete first');
            return;
        }
        if (mTask.current.hours <= 0) {
            setIsLoading(false);
            Alert.alert('Error', 'Hours must be greater than 0');
            return;
        }

        try {
            mTask.current.cost = mTask.current.hours * mTask.current.assignedUser.hourlyRate;
            mTask.current.endDate = new Date().valueOf();

            await updateTask(mTaskId.current, mTask.current);
            await localUpdateProject();

            setIsLoading(false);
            Alert.alert("Success!", "Updated", 
            [
                { 
                    text: 'OK',
                    onPress: () => { navigation.goBack(); },
                },
            ]);
        } catch(error) {
            console.log(error);
            setIsLoading(false);
            Alert.alert("Error", "Unable to update task.");
        }
    }

    // Navigation
    const navigateToPrerequisitesScreen = () => {
        navigation.navigate('Pre-requisites', {'task': mTask.current})
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
        if (!mTaskId.current) {
            return;
        }

        setIsLoading(true);

        let unsubscribe = getTask(mTaskId.current, async (task) => {
            try {
                let localProject = await getProjectOnce(task.projectId);
                mProject.current = {...localProject};
            } catch (error) {
                console.log(error);
                Alert.alert('Error', 'Error retrieving project');
            }
            setIsLoading(false);
            
            const localTask = {...task};
            setTask(localTask);

            let localStartDateText = getDateText(localTask.startDate);
            setStartDateText(localStartDateText);

            let localEndDateText = getDateText(localTask.endDate);
            setEndDateText(localEndDateText);

            mTask.current = {...localTask};
            mPreviousStatus.current = localTask.status;
        });

        mUnsubscribe.current = unsubscribe;
        return () => { console.log('my task details unsubscribe'); mUnsubscribe.current(); };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            { isLoading && <CustomActivityIndicator /> }

            <Text style={[styles.label, {marginTop: 2}]}>Task Name:</Text>
            <TextInput editable={false} style={styles.textInput} placeholder='Enter Task Name' value={task.name} onChangeText={(textValue) => updateTaskState('name', textValue)}/>

            <Text style={styles.label}>Task Description:</Text>
            <TextInput editable={false} multiline={true} numberOfLines={5} style={styles.multiLineInput} placeholder='Enter Task Description' value={task.description} onChangeText={(textValue) => updateTaskState('description', textValue)}/>

            {   (task.status === 'Complete') &&
                <Text style={styles.label}>Hours:</Text>
            }
            {
                (task.status === 'Complete') &&
                <TextInput style={styles.textInput} placeholder='Enter Task Hours' value={String(task.hours)} onChangeText={(textValue) => updateTaskState('hours', textValue)}/>
            }

            <Text style={[styles.label, {marginTop: 20,}]}>Status:</Text>
            <SegmentedControls tint={'darkslateblue'} containerStyle={styles.segmentedControl} optionStyle={styles.option} options={statusOptions} direction='row' onSelection={(selectedOption) => updateTaskState('status', selectedOption)} selectedOption={task.status}/>
            {/* <Text style={[styles.label, {marginTop: 25,}]}>Assigned Member</Text>
            <TouchableOpacity style={styles.listItem} onPress={() => navigateToAssignMemberScreen()}>
                <Card style={styles.card}>
                    <Text style={styles.text}>Assign Member</Text>
                    <Text style={styles.text}>{'>'}</Text>
                </Card>
            </TouchableOpacity> */}
            {/* {   task.assignedUser.email  &&
                <MemberListItem member={task.assignedUser} style={styles.memberListItem} /> */}

            <Text style={[styles.label, {marginTop: 20,}]}>Prerequisites (count: {task.preRequisites.length})</Text>
            <TouchableOpacity style={styles.listItem} onPress={() => navigateToPrerequisitesScreen()}>
                <Card style={styles.card}>
                    <Text style={styles.text}>View Prerequisites</Text>
                    <Text style={styles.text}>{'>'}</Text>
                </Card>
            </TouchableOpacity>

            <Text style={styles.label}>Start Date: {startDateText}</Text>
            {
                (task.status === 'Complete') &&
                <Text style={styles.label}>End Date: {endDateText}</Text>
            }

            {/* {
                (task.status === 'Complete') &&
                <Text style={styles.label}>Cost:</Text>
            } */}

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
    segmentedControl: {
        width: '100%',
    },
    option: {
        padding: 5,
        fontSize: 18,
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
        marginTop: 50,
    }
});