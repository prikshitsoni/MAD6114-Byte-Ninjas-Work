import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Alert, Button } from 'react-native';
import CustomButton from '../Components/CustomButton';
import { firebase } from '../Firebase/config';


export default function UserRegisterScreen({navigation}) {

    const [UserFName, setFName] = useState('');
    const [UserLName, setLName] = useState('');
    const [UserPosition, setPosition] = useState('');
    const [UserRate, setRate] = useState('');
    const [UserEmail,setEmail] = useState('');
    const [UserPassword,setPassword] = useState('');

    const onFNameChanged = (textInput) => setFName(textInput);
    const onLNameChanged = (textInput) => setLName(textInput);
    const onPositionChanged = (textInput) => setPosition(textInput);
    const onRateChanged = (textInput) => setRate(textInput);
    const onEmailChanged = (textInput) => setEmail(textInput);
    const onPasswordChanged = (textInput) => setPassword(textInput);


    //Create User
    const createNewUser = () => {
        if(UserFName||UserLName||UserRate||UserEmail||UserPassword||UserPosition != ''){
            firebase.auth().createUserWithEmailAndPassword(UserEmail,UserPassword).then(() => {
                addUser();
                console.log('User account created & signed in!');
                navigation.navigate('Home');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    alert('That email address is already in use!');
                }
                if (error.code === 'auth/invalid-email') {
                    alert('That email address is invalid!');
                }
                if(error.code === 'auth/weak-password'){
                    alert('Password should be atleat 6 characters');
                }
                console.error(error);
            });
        }

        else{
            alert("All fields are required");
        }

    };

    //Add User Details
    const addUser = () => {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const response = await firebase.firestore().collection('users')
                .doc(UserEmail)
                .set({
                    firstName:UserFName,
                    lastName:UserLName,
                    position:UserPosition,
                    hourlyRate:UserRate,
                    email:UserEmail,
                })
                resolve(response);
            } catch(error) {
                reject(error);
            }
        })
        return promise;
    };

    return (
        <View style={styles.container}>
        <Text style={styles.text}>Register Yourself here !</Text>
        <TextInput style={styles.textInput} placeholder='First Name' value={UserFName} onChangeText={onFNameChanged}></TextInput>
        <TextInput style={styles.textInput} placeholder='Last Name' value={UserLName} onChangeText={onLNameChanged}></TextInput>
        <TextInput style={styles.textInput} placeholder='Rate/Hour' value={UserRate} onChangeText={onRateChanged}></TextInput>
        <TextInput style={styles.textInput} placeholder='Position' value={UserPosition} onChangeText={onPositionChanged}></TextInput>
        <TextInput style={styles.textInput} placeholder='Email' value={UserEmail} onChangeText={onEmailChanged}></TextInput>
        <TextInput style={styles.textInput} placeholder='Password' value={UserPassword} onChangeText={onPasswordChanged}></TextInput>
        <CustomButton style={styles.btn} title='Register' onPress={createNewUser}/>
        <StatusBar style="auto" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    text: {
        padding: 20,
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    textInput: {
        fontSize: 18,
        padding: 15,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d3d3d3',
        width: '100%',
    },
    btn: {
        width: '100%',
        marginTop: 10,
    },
});