import { StatusBar } from 'expo-status-bar';
import React, {useState, useLayoutEffect, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, FlatList, Button, Image, Alert } from 'react-native';

import palette from 'google-material-color-palette-json';

import CustomActivityIndicator from '../Components/CustomActivityIndicator';
import SelectPreRequisitesListItem from '../Components/SelectPreRequisitesListItem';

import { getTasks, updateTask } from '../Helpers/TasksHelper';
import { updateProject } from '../Helpers/ProjecstHelper';
import TaskListItem from '../Components/TaskListItem';

export default function MyTaskPrerequisitesScreen({route, navigation}) {
    const { task } = route.params;
    
    const mTask = useRef({...task});
    const mTasks = useRef([]);

    const [isLoading, setIsLoading] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(async () => {
        if (mTask.current.preRequisites === null || mTask.current.preRequisites.length === 0) {
            return;
        }

        setIsLoading(true);

        try {
            let localTasks = await getTasks(mTask.current.preRequisites);
            setIsLoading(false);

            mTasks.current = localTasks.concat([]);
            setTasks(localTasks);
        } catch (error) {
            setIsLoading(false);

            console.log(error);
            Alert.alert('Error', 'Error getting pre-requisites');
        }
    }, []);

    return (
        <View style={styles.container}>
            { isLoading && <CustomActivityIndicator /> }
            {
                tasks.length === 0 &&
                <Text style={styles.emptyText}>There are no Pre-requisites for this task.</Text>
            }
            {
                tasks.length !== 0 &&
                <FlatList
                style={styles.flatList}
                data={tasks} 
                renderItem={({ item }) => <TaskListItem task={item} />}
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
        justifyContent: 'center',
    },
    flatList: {
        width: '100%',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        paddingTop: 15, 
        paddingBottom: 10,
        paddingLeft: 10, 
        paddingRight: 10,
        marginTop: 10,
        color: palette.grey.shade_800,
    },
});