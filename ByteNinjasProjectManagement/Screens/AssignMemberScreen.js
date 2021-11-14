import { StatusBar } from 'expo-status-bar';
import React, {useState, useLayoutEffect, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, FlatList, Button, Image, Alert } from 'react-native';

import CustomActivityIndicator from '../Components/CustomActivityIndicator';
import SelectMemberListItem from '../Components/SelectMemberListItem';
import { getAllUsers, getUsers } from '../Helpers/UsersHelper';
import { updateTask } from '../Helpers/TasksHelper';
import { updateProject } from '../Helpers/ProjecstHelper';

export default function AssignMemberScreen({route, navigation}) {
    const { assignedMember } = route.params;
    const { task } = route.params;
    const { project } = route.params;
    const { doneCallback } = route.params;
    
    const mProject = useRef({...project});
    const mTask = useRef({...task});
    const mUsers = useRef([]);
    const mSelectedIndex = useRef(-1);

    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const setupSelectedIndex = (users) => {
        if (!mTask.current.assignedUser.id) {
            return;
        }

        let index = users.findIndex(u => u.id === mTask.current.assignedUser.id);
        if (index !== -1) {
            mSelectedIndex.current = index;
            setSelectedIndex(index);
        }
    };

    const toggleSelectedIndex = (index) => {
        mSelectedIndex.current = index;
        setSelectedIndex(index);
    }

    const donePressed = async () => {
        let localTask = {...mTask.current};
        const selectedUser = mUsers.current[mSelectedIndex.current];

        localTask.assignedUser = selectedUser;
        setIsLoading(true);

        try {
            await updateTask(localTask.id, localTask);
            await updateProject(mProject.current.id, mProject.current);
            setIsLoading(false);

            navigation.goBack();
        } catch (error) {
            setIsLoading(false);

            console.log(error);
            Alert.alert('Error', 'Unable to assign member');
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
        setIsLoading(true);

        try {
            let localUsers = await getUsers(project.members);
            mUsers.current = {...localUsers};
            setUsers(localUsers);
            setupSelectedIndex(localUsers);

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);

            console.log(error);
            Alert.alert('Error', 'Error fetching members');
        }
    }, []);

    return (
        <View style={styles.container}>
            { isLoading && <CustomActivityIndicator /> }
            <FlatList
                style={styles.flatList}
                data={users} 
                renderItem={({ item, index }) => <SelectMemberListItem user={item} selected={(selectedIndex === index)} onPress={() => toggleSelectedIndex(index)}/>}
            />
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
});