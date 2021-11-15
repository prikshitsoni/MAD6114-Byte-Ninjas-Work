import { StatusBar } from 'expo-status-bar';
import React, {useState, useLayoutEffect, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, FlatList, Button, Image, TouchableOpacity, Alert, } from 'react-native';

import palette from 'google-material-color-palette-json';
import { Card } from 'react-native-shadow-cards';
import CustomActivityIndicator from '../Components/CustomActivityIndicator';
import TaskListItem from '../Components/TaskListItem';

import { getProject } from '../Helpers/ProjecstHelper';
import { getMyTasks } from '../Helpers/TasksHelper';

export default function MyTasksScreen({route, navigation}) {
    // Mutable References
    const mUnsubscribe = useRef(null);
    const mMyTasks = useRef([]);

    // State Variables
    const [isLoading, setIsLoading] = useState(false);
    const [myTasks, setMyTasks] = useState([]);

    // Methods
    // const saveCallbackFromAddEdit = (task) => {
    //     const localTask = {...task};
    //     const localTasks = mTasks.current.concat([]);
    //     const index = localTasks.findIndex(t => t.id === task.id);

    //     if (index === -1) {
    //         localTasks.push(localTask);
    //     } else {
    //         localTasks[index] = localTask;
    //     }

    //     mTasks.current = localTasks.concat([]);
    //     setTasks(localTasks);

    //     navigation.goBack();
    // };

    // const donePressed = () => {
    //     navigation.goBack();
    //     // doneCallback(mTasks.current);
    // };

    // Navigation
    const navigateToMyTaskDetails = (taskId = '') => {
        navigation.navigate('Task Details', { 'taskId': taskId });
    };

    // Lifecycles
    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <View style={ {flexDirection:'row',} }>
    //                 <Button title='Add' color='#fff' onPress={() => navigateToAddEditTask()}/>
    //                 <Button title='Done' color='#fff' onPress={() => donePressed()}/>
    //             </View>
    //             // <Image source={require('../assets/byte-ninja.png')} style={{width: 20, height: 20, marginRight: 5,}}></Image>
    //         ),
    //     });
    // }, [navigation]);

    useEffect(async () => {
        console.log('my tasks screen use effect');

        setIsLoading(true);

        let unsubscribe = await getMyTasks((myTasks) => {
            setIsLoading(false);
            const localTasks = myTasks.concat([]);
            
            console.log('local my tasks');
            console.log(localTasks);

            mMyTasks.current = localTasks.concat([]);
            setMyTasks(localTasks);
        });

        mUnsubscribe.current = unsubscribe;
    }, []);

    useEffect(() => {
        // Unsubscribe when component will unmount to prevent memory leak
        return () => { console.log('unsubscribe my tasks'); mUnsubscribe.current(); };
    }, []);

    // Render
    return (
        <View style={styles.container}>
            { isLoading && <CustomActivityIndicator /> }
            { 
                (myTasks.length === 0) &&
                <Text style={styles.emptyText}>You Don't Have any Tasks Assigned to you.</Text>
            }
            {
                (myTasks.length !== 0) &&
                <FlatList
                    style={styles.flatList}
                    data={myTasks}
                    renderItem={({item}) => <TaskListItem task={item} onPress={() => navigateToMyTaskDetails(item.id)}/>}
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