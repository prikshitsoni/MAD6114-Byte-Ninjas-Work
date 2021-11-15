import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';
import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Image, Alert,Button } from 'react-native';
//import { Button } from 'react-native-elements/dist/buttons/Button';
import CustomButton from '../Components/CustomButton';
import { firebase } from '../Firebase/config';

export default function LoginScreen({navigation}) {
    const [emailVal, setEmailVal] = useState('');
    const [passwordVal, setPasswordVal] = useState('');

    const onEmailChanged = (textInput) => setEmailVal(textInput);
    const onPasswordChanged = (textInput) => setPasswordVal(textInput);

    const performLogin = () => {
        // const auth = getAuth();
        // signInWithEmailAndPassword(auth, emailVal, passwordVal)
        //     .then((userCredential) => {
        //         navigation.navigate('Home');
        //     })
        //     .catch((error) => {
        //         Alert.alert("Log in Error", "Please enter valid email and password");
        //     });
        firebase.auth()
            .signInWithEmailAndPassword(emailVal, passwordVal)
            .then((response) => {
                navigation.navigate('Home');
            })
            .catch(error => {
                Alert.alert("Sign in Error", "Please check username and password");
            });
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/Logo.png')} style={{width: 300, height: 300,}}></Image>
            <TextInput style={styles.textInput} placeholder='Enter Email' value={emailVal} onChangeText={onEmailChanged}></TextInput>
            <TextInput secureTextEntry={true} style={styles.textInput} placeholder='Enter Password' value={passwordVal} onChangeText={onPasswordChanged}></TextInput>
            {/* Prikshit --------------------------------------------*/}
            <Button title={'Forget Password ?'} onPress={() => navigation.navigate('ResetPasswordScreen')}></Button>
            {/* Prikshit --------------------------------------------*/}


            <CustomButton style={styles.btn} title='Login' onPress={() => performLogin()}/>

            {/* Prikshit -------------------------------------------*/}
            <Button style={styles.btn} title="Don't have an account? Sign Up ." onPress={() => navigation.navigate('UserRegisterScreen')}></Button>
            {/* prikshit -------------------------------------------*/}

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
        fontSize: 30,
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
        marginTop: 50,
        marginBottom:10,
    },
});