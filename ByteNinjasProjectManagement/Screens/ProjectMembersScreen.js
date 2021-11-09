import { StatusBar } from 'expo-status-bar';
import React, {useState, useLayoutEffect, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, FlatList, Button, Image, TouchableOpacity, Alert, } from 'react-native';

import { Card } from 'react-native-shadow-cards';
import CustomActivityIndicator from '../Components/CustomActivityIndicator';
import MemberListItem from '../Components/MemberListItem';

import { getUsers } from '../Helpers/UsersHelper';

export default function ProjectMembersScreen({route, navigation}) {
    // Screen Params
    const { project } = route.params;

    // Mutable References
    const mMembers = useRef([]);

    // State Variables
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState([]);

    // Methods
    const doneCallbackFromSelect = (selectedMembers) => {
        let localSelectedMembers = selectedMembers.concat([]);

        console.log(localSelectedMembers);

        project.members = localSelectedMembers.map((u => u.email));
        mMembers.current = localSelectedMembers.concat([]);
        setMembers(localSelectedMembers);

        navigation.goBack();
    };

    // Navigation
    const navigateToSelectMembers = () => {
        navigation.navigate('Select Members', { "currentMembers": mMembers.current, "doneCallback": doneCallbackFromSelect });
    };

    // Lifecycles
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title='Done' color='#fff'/>
                // <Image source={require('../assets/byte-ninja.png')} style={{width: 20, height: 20, marginRight: 5,}}></Image>
            ),
        });
    }, [navigation]);

    useEffect( async () => {
        console.log('In use effect');
        if (!project || project.members.length === 0) {
            return;
        }

        setIsLoading(true);

        try {
            let localMembers = await getUsers(project.members);

            mMembers.current = localMembers.concat([]);
            setMembers(localMembers);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            Alert.alert("Error", "Error fetching members");
        }
    }, []);

    // Render
    return (
        <View style={styles.container}>
            { isLoading && <CustomActivityIndicator /> }
            <TouchableOpacity style={styles.listItem} onPress={() => navigateToSelectMembers()}>
                <Card style={styles.card}>
                    <Text style={styles.text}>Select Members</Text>
                    <Text style={styles.text}>{'>'}</Text>
                </Card>
            </TouchableOpacity>
            <Text>This is the members screen</Text>
            <FlatList
                style={styles.flatList}
                data={members} 
                renderItem={({item}) => <MemberListItem member={item} />}
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
        padding: 15,
    },
    flatList: {
        width: '100%',
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
});