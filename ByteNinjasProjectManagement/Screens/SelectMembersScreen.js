import { StatusBar } from 'expo-status-bar';
import React, {useState, useLayoutEffect, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, FlatList, Button, Image } from 'react-native';

import CustomActivityIndicator from '../Components/CustomActivityIndicator';
import SelectMemberListItem from '../Components/SelectMemberListItem';
import { getAllUsers } from '../Helpers/UsersHelper';

export default function SelectMembersScreen({route, navigation}) {
    const { currentMembers } = route.params;
    const { doneCallback } = route.params;
    
    const mUsers = useRef([]);
    const mSelectedIndexes = useRef([]);

    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedIndexes, setSelectedIndexes] = useState([]);

    const setupSelectedIndexes = (users) => {
        let localIndexes = new Array(users.length).fill(false);

        for (let i = 0; i < users.length; i++) {
            let user = users[i];

            if (currentMembers.findIndex(u => u.email === user.email) !== -1) {
                localIndexes[i] = true;
            }
        }

        mSelectedIndexes.current = localIndexes.concat([]);
        setSelectedIndexes(localIndexes);
    };

    const toggleSelectedIndex = (index) => {
        let localIndexes = selectedIndexes.concat([]);
        localIndexes[index] = !localIndexes[index];

        console.log('index: ' + index);
        console.log('new value: ' + localIndexes[index]);

        console.log(localIndexes);

        mSelectedIndexes.current = localIndexes.concat([]);
        setSelectedIndexes(localIndexes);
    }

    const donePressed = () => {
        console.log('done pressed');
        console.log('users length: ' + mUsers.current.length);
        console.log(mSelectedIndexes.current);
        let selectedUsers = [];

        for (let i = 0; i < mUsers.current.length; i++) {
            console.log("index: " + i)
            console.log("selected: " + mSelectedIndexes.current[i]);
            if (mSelectedIndexes.current[i]) {
                selectedUsers.push(mUsers.current[i]);
            }
        }

        doneCallback(selectedUsers);
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title='Done' color='#fff' onPress={() => donePressed()}/>
                // <Image source={require('../assets/byte-ninja.png')} style={{width: 20, height: 20, marginRight: 5,}}></Image>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        setIsLoading(true);

        let unsubscribe = getAllUsers((users) => {
            setIsLoading(false);

            let localUsers = users.concat([]);
            setUsers(localUsers);
            mUsers.current = localUsers.concat([]);

            setupSelectedIndexes(localUsers);
        });

        // Unsubscribe when component will unmount to prevent memory leak
        return () => { console.log('unsubcribe'); unsubscribe() };
    }, []);

    return (
        <View style={styles.container}>
            { isLoading && <CustomActivityIndicator /> }
            <FlatList
                style={styles.flatList}
                data={users} 
                renderItem={({ item, index }) => <SelectMemberListItem user={item} selected={selectedIndexes[index]} onPress={() => toggleSelectedIndex(index)}/>}
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