import { StatusBar } from 'expo-status-bar';
//import React from 'react';
import { StyleSheet, Text, View , TextInput, Alert} from 'react-native';
import CustomButton from '../Components/CustomButton';
import { firebase,currentUser } from '../Firebase/config';
import React, {Component,useEffect,useRef, useState } from 'react'
import { saveUser ,getUser,User} from '../Helpers/ProfileHelper';


export default function ProfileScreen(route,navigation) 
{
   
    let isFirstLoad = useRef(true);



    const [state, setState] = useState({
        'user': new User()
       
    });
   // const  [state, setState] = useState({ user: {} });

    // const  [firstName, setName] = useState("")
    // const  [lastName, setlastName] = useState("")
    // const  [position, setposition] = useState("")
    // const  [hourlyRate, sethour] = useState("")

const updateUserState = (key, value) => {

   const localState = {...state};
   const user = localState.user;
   user[key] = value;

   // project[key] = value;
   console.log(key);

   setState(localState);
 
   }
   const onSavePressed = async () => {

    try 
    {
        await saveUser(state.user,"updatedone");
        console.log(state.user);
        alert("Saved")
    }
     catch(error) {
        console.log(error);
    
    }

      }
    const Signout = () => {
       // navigation.navigate('Home');
        // firebase.auth()
        //     .Signout()
        //     .then((response) => {
        //       //  navigation.navigate('Home');
        //       currentUser = null;
        //     })
        //     .catch(error => {
        //         Alert.alert("Sign in Error", "Please check username and password");
        //     });
        alert('Sign Out');
    };
          
useEffect(async () => {

    if (isFirstLoad.current ) {
        isFirstLoad.current = false;

   

    let unsubScribe = getUser(currentUser.email, (user) => {
        const localState = { ...state };
        let localUser = {...user}; // Copy
        // let isComplete = getIsComplete(localUser);
        // let statusText = getStatusText(localUser);

        localState.user = localUser;
        // localState.statusText = statusText;
        // localState.isComplete = isComplete;

        setState(localState);

        // setProject(localProject);
        // updateProjectState(localProject);
        // updateIsComplete(localProject);
    });

    // Unsubscribe when component will unmount to prevent memory leak
    return () => { unsubScribe() };
    }
});






         return(
             <View style={styles.container}>
               
             <Text style={styles.text}>Profile</Text>
             <Text style={styles.label}> First Name</Text>
               <TextInput editable = {true} style={styles.textInput} value = { state.user.firstName } placeholder='First Name' onChangeText ={(textValue) => updateUserState('firstName', textValue)} />
               

             <Text style={styles.label}>Last Name</Text>
             <TextInput  style={styles.textInput} value = { state.user.lastName  } placeholder='Last Name' onChangeText ={(textValue) => updateUserState('lastName', textValue)}/>
             <Text style={styles.label}>Pay Rate</Text>
             <TextInput  style={styles.textInput} value = { state.user.hourlyRate } placeholder='hourly Rate ' onChangeText ={(textValue) => updateUserState('hourlyRate', textValue)}/>
             <Text style={styles.label}>Position</Text>
             <TextInput  style={styles.textInput} value = { state.user.position } placeholder='Position' onChangeText ={(textValue) => updateUserState('position', textValue)} />


             <CustomButton style={styles.btn} title='Save'  onPress={() => onSavePressed()} />
             <CustomButton style={styles.btn1} title='Sign-out'  onPress={() => Signout()} />  
              <StatusBar style="auto" />
                </View>
    
                );
                  } 

// // export default function ProfileScreen() 
// // {



      const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'flex-start',
            
        },
        

        text: {
            padding: 20,
            fontSize: 40,
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
        label: {
            fontSize: 18,
           
            paddingLeft: 0, 
            paddingRight: 40, 
            textAlign : "left",
            alignContent: "flex-start",
            color: 'black',
        },
        btn: {
            width: '50%',
            marginTop: 20,
        },
        btn1: {
            width: '50%',
            marginTop: 10, 
           
         }
     
         });