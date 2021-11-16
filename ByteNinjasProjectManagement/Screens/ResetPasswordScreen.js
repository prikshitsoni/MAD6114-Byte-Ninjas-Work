import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Alert, Button } from 'react-native';
import CustomButton from '../Components/CustomButton';
import { firebase } from '../Firebase/config';


export default function ResetPasswordScreen() {

    const [UserEmail,setEmail] = useState(''); 
    const [messege,setMessege] = useState('');
    const onEmailChanged = (textInput) => setEmail(textInput);

    const sendRestLink = () => {
        if(UserEmail != ''){
            firebase.auth().sendPasswordResetEmail(UserEmail);
            setMessege('Please check you email for rest link..');
            setEmail('')
        }
        else{

            setMessege('Please enter email.')
        }
        
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Reset link will be sent to you Email</Text>
            <TextInput style={styles.textInput} placeholder='Enter Email' value={UserEmail} onChangeText={onEmailChanged}></TextInput>
            <CustomButton style={styles.btn} title='Send Reset Link' onPress={sendRestLink}/>
            <Text style={{margin:20}}>{messege}</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    text: {
        padding: 40,
        fontSize: 25,
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