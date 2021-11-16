import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';

import ProjectsScreen from './Screens/ProjectsScreen';
import AddEditProjectScreen from './Screens/AddEditProjectScreen';
import ProjectMembersScreen from './Screens/ProjectMembersScreen';
import SelectMembersScreen from './Screens/SelectMembersScreen';
import ProjectTasksScreen from './Screens/ProjectTasksScreen';
import AddEditTaskScreen from './Screens/AddEditTaskScreen';
import AssignMemberScreen from './Screens/AssignMemberScreen';
import SelectPrerequisitesScreen from './Screens/SelectPrerequisitesScreen';

import MyTasksScreen from './Screens/MyTasksScreen';
import MyTaskDetailsScreen from './Screens/MyTaskDetailsScreen';
import MyTaskPrerequisitesScreen from './Screens/MyTaskPrerequisitesScreen';

import ProfileScreen from './Screens/ProfileScreen';
import LoginScreen from './Screens/LoginScreen';

import UserRegisterScreen from './Screens/UserRegisterScreen'
import ResetPasswordScreen from './Screens/ResetPasswordScreen';

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
        
                    if (route.name === 'Projects') {
                        if (focused) {
                            return <Image source={require('./assets/icons8-trello-50-2.png')} style={{width: 35, height: 35}} />;
                        } else {
                            return <Image source={require('./assets/icons8-trello-50.png')} style={{width: 35, height: 35}} />;
                        }
                    } else if (route.name === 'Tasks') {
                        if (focused) {
                            return <Image source={require('./assets/icons8-tasks-50-2.png')} style={{width: 35, height: 35}} />;
                        } else {
                            return <Image source={require('./assets/icons8-tasks-50.png')} style={{width: 35, height: 35}} />;
                        }
                    } else {
                        if (focused) {
                            return <Image source={require('./assets/icons8-user-50-2.png')} style={{width: 35, height: 35}} />;
                        } else {
                            return <Image source={require('./assets/icons8-user-50.png')} style={{width: 35, height: 35}} />;
                        }
                    }
                },
                tabBarActiveTintColor: 'darkslateblue',
                tabBarInactiveTintColor: 'gray',
                headerStyle: {
                    backgroundColor: 'darkslateblue',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Projects" component={ProjectStackNavigator} />
            <Tab.Screen name="Tasks" component={MyTasksStackNavigator} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

const ProjectStackNavigator = () => {
    return (
        <ProjectsStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'darkslateblue',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <ProjectsStack.Screen name="My Projects" component={ProjectsScreen}/>
            <ProjectsStack.Screen name="Add Project" component={AddEditProjectScreen} options={({ route }) => ({ title: route.params.headerTitle })} />
            <ProjectsStack.Screen name="Members" component={ProjectMembersScreen}/>
            <ProjectsStack.Screen name="Select Members" component={SelectMembersScreen}/>
            <ProjectsStack.Screen name="Tasks" component={ProjectTasksScreen} />
            <ProjectsStack.Screen name="Add Task" component={AddEditTaskScreen} options={({ route }) => ({ title: route.params.headerTitle })} />
            <ProjectsStack.Screen name="Assign Member" component={AssignMemberScreen} />
            <ProjectsStack.Screen name="Select Pre-requisites" component={SelectPrerequisitesScreen} />
        </ProjectsStack.Navigator>
    );
}

const MyTasksStackNavigator = () => {
    return (
        <MyTasksStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'darkslateblue',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <MyTasksStack.Screen name="My Tasks" component={MyTasksScreen} />
            <MyTasksStack.Screen name="Task Details" component={MyTaskDetailsScreen} />
            <MyTasksStack.Screen name="Pre-requisites" component={MyTaskPrerequisitesScreen} />
        </MyTasksStack.Navigator>
    );
};

const Tab = createBottomTabNavigator();
const MainStack = createStackNavigator();
const ProjectsStack = createStackNavigator();
const MyTasksStack = createStackNavigator();

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default function App() {
    return (
        <NavigationContainer>
            <MainStack.Navigator
                screenOptions={{
                    headerStyle: {
                      backgroundColor: 'darkslateblue',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                    headerShown: false,
                }}>
                <MainStack.Screen name='Login Screen' 
                    component={LoginScreen}
                    options={{headerShown: true}}>
                </MainStack.Screen>
                <MainStack.Screen name='Home' 
                    component={TabNavigator}
                    options={{ headerShown: false }}>
                </MainStack.Screen>
                

                    <MainStack.Screen name='UserRegisterScreen' 
                    component={UserRegisterScreen}
                    options={{ headerShown: true }}>
                </MainStack.Screen>

                <MainStack.Screen name='ResetPasswordScreen' 
                    component={ResetPasswordScreen}
                    options={{ headerShown: true }}>
                </MainStack.Screen>





            </MainStack.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
