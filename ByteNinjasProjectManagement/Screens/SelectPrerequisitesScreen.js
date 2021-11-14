import { StatusBar } from 'expo-status-bar';
import React, {useState, useLayoutEffect, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, FlatList, Button, Image, Alert } from 'react-native';

import palette from 'google-material-color-palette-json';

import CustomActivityIndicator from '../Components/CustomActivityIndicator';
import SelectPreRequisitesListItem from '../Components/SelectPreRequisitesListItem';

import { getTasks, updateTask } from '../Helpers/TasksHelper';
import { updateProject } from '../Helpers/ProjecstHelper';

export default function SelectPrerequisitesScreen({route, navigation}) {
    const { project } = route.params;
    const { task } = route.params;
    
    const mProject = useRef({...project});
    const mTask = useRef({...task});
    const mTasks = useRef([]);
    const mSelectedIndexes = useRef([]);

    const [isLoading, setIsLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedIndexes, setSelectedIndexes] = useState([]);

    const setupSelectedIndexes = (tasks) => {
        let localIndexes = new Array(tasks.length).fill(false);

        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i];

            if (mTask.current.preRequisites.indexOf(task.id) !== -1) {
                localIndexes[i] = true;
            }
        }

        mSelectedIndexes.current = localIndexes.concat([]);
        setSelectedIndexes(localIndexes);
    };

    const toggleSelectedIndex = (index) => {
        let localIndexes = mSelectedIndexes.current.concat([]);
        localIndexes[index] = !localIndexes[index];

        mSelectedIndexes.current = localIndexes.concat([]);
        setSelectedIndexes(localIndexes);
    }

    const donePressed = async () => {
        let selectedTaskIds = [];

        for (let i = 0; i < mTasks.current.length; i++) {
            if (mSelectedIndexes.current[i]) {
                selectedTaskIds.push(mTasks.current[i].id);
            }
        }

        try {
            setIsLoading(true);

            let localTask = {...mTask.current};
            localTask.preRequisites = selectedTaskIds;

            await updateTask(localTask.id, localTask);
            await updateProject(mProject.current.id, mProject.current);

            setIsLoading(false);
            navigation.goBack();
        } catch (error) {
            setIsLoading(false);

            console.log(error);
            Alert.alert('Error', 'Error Saving Pre-requisites.');
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title='Done' color='#fff' onPress={() => donePressed()}/>
                // <Image source={require('../assets/byte-ninja.png')} style={{width: 20, height: 20, marginRight: 5,}}></Image>
            ),
        });
    }, [navigation]);

    useEffect(async () => {
        if (project.tasks === null || project.tasks.length === 0) {
            return;
        }

        setIsLoading(true);

        try {
            let localTasks = await getTasks(project.tasks);
            let preRequisiteTasks = [];

            for (let i = 0; i < localTasks.length; i++) {
                let localTask = localTasks[i];

                if (localTask.id != mTask.current.id && (localTask.preRequisites.indexOf(mTask.current.id) === -1)) {
                    preRequisiteTasks.push({...localTask});
                }
            }

            setIsLoading(false);

            mTasks.current = preRequisiteTasks.concat([]);
            setTasks(preRequisiteTasks);
            setupSelectedIndexes(preRequisiteTasks);
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
                <Text style={styles.emptyText}>You Don't have tasks you can add as pre-requisites in this project.</Text>
            }
            {
                tasks.length !== 0 &&
                <FlatList
                style={styles.flatList}
                data={tasks} 
                renderItem={({ item, index }) => <SelectPreRequisitesListItem task={item} selected={selectedIndexes[index]} onPress={() => toggleSelectedIndex(index)}/>}
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