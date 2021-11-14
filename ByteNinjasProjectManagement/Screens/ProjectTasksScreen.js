import { StatusBar } from 'expo-status-bar';
import React, {useState, useLayoutEffect, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, FlatList, Button, Image, TouchableOpacity, Alert, } from 'react-native';

import palette from 'google-material-color-palette-json';
import { Card } from 'react-native-shadow-cards';
import CustomActivityIndicator from '../Components/CustomActivityIndicator';
import TaskListItem from '../Components/TaskListItem';

import { getProject } from '../Helpers/ProjecstHelper';
import { getTasks } from '../Helpers/TasksHelper';

export default function ProjectTasksScreen({route, navigation}) {
    // Screen Params
    const { project } = route.params;
    const { doneCallback } = route.params;

    // Mutable References
    const mProject = useRef({...project});
    const mTasks = useRef([]);

    // State Variables
    const [isLoading, setIsLoading] = useState(false);
    const [tasks, setTasks] = useState([]);

    // Methods
    const saveCallbackFromAddEdit = (task) => {
        const localTask = {...task};
        const localTasks = mTasks.current.concat([]);
        const index = localTasks.findIndex(t => t.id === task.id);

        if (index === -1) {
            localTasks.push(localTask);
        } else {
            localTasks[index] = localTask;
        }

        mTasks.current = localTasks.concat([]);
        setTasks(localTasks);

        navigation.goBack();
    };

    const donePressed = () => {
        navigation.goBack();
        // doneCallback(mTasks.current);
    };

    // Navigation
    const navigateToAddEditTask = (taskId = '') => {
        navigation.navigate('Add Task', { 'project': mProject.current, 'taskId': taskId, 'saveCallback': saveCallbackFromAddEdit })
    }

    // Lifecycles
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={ {flexDirection:'row',} }>
                    <Button title='Add' color='#fff' onPress={() => navigateToAddEditTask()}/>
                    <Button title='Done' color='#fff' onPress={() => donePressed()}/>
                </View>
                // <Image source={require('../assets/byte-ninja.png')} style={{width: 20, height: 20, marginRight: 5,}}></Image>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        console.log('project tasks screen use effect');

        let unsubscribe = getProject(mProject.current.id, async (project) => {
            console.log('get project callback');

            mProject.current = { ...project };
            
            if (!project || project.tasks.length === 0) {
                return;
            }

            setIsLoading(true);

            try {
                let localTasks = await getTasks(project.tasks);
                console.log('in local tasks');
                console.log(localTasks);
    
                mTasks.current = localTasks.concat([]);
    
                setTasks(localTasks);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
                Alert.alert("Error", "Error fetching tasks");
            }
        });

        // Unsubscribe when component will unmount to prevent memory leak
        return () => { console.log('unsubscribe project tasks'); unsubscribe() };
    }, []);

    // Render
    return (
        <View style={styles.container}>
            { isLoading && <CustomActivityIndicator /> }
            { 
                (tasks.length === 0) &&
                <Text style={styles.emptyText}>You Don't have any Project Tasks. Tap 'Add' to add Tasks to the Project.</Text>
            }
            {
                (tasks.length !== 0) &&
                <FlatList
                    style={styles.flatList}
                    data={tasks}
                    renderItem={({item}) => <TaskListItem task={item} onPress={() => navigateToAddEditTask(item.id)}/>}
                />   
            }
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    flatList: {
        width: '100%',
    },
    listItem: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 8,
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
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
    text: {
        fontSize: 18,
        fontWeight: '400',
        paddingTop: 10, 
        paddingBottom: 10,
        paddingLeft: 10, 
        paddingRight: 10,
        color: 'darkslateblue',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        height: '100%',
        paddingTop: 15, 
        paddingBottom: 10,
        paddingLeft: 10, 
        paddingRight: 10,
        marginTop: 10,
        color: palette.grey.shade_800,
    },
});