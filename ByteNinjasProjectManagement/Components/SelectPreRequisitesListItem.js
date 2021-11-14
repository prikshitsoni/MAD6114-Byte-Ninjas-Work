import palette from 'google-material-color-palette-json';
import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';

import {Card} from 'react-native-shadow-cards';
import { CheckBox } from 'react-native-elements'

export default function SelectPreRequisitesListItem({ task, selected, onPress }) {
    return(
        <TouchableOpacity style={styles.listItem} onPress={() => onPress()}>
            <Card style={styles.card}>
                <View style={styles.detailsView}>
                    <Text style={styles.listItemText}>{task.name}</Text>
                    <Text style={styles.listItemSubText}>{task.assignedUser.firstName} {task.assignedUser.lastName}</Text>
                    <Text style={styles.listItemSubText}>${task.assignedUser.hourlyRate} / hour</Text>
                </View>
                <CheckBox style={styles.checkbox} checked={selected} size={35} checkedColor='darkslateblue'/>
            </Card>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    listItem: {
        flex: 1,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#f8f8f8',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
    },
    listItemText: {
        fontSize: 22,
        width: '100%',
        fontWeight: '600',
        color: palette.grey.shade_900,
        padding: 2,
    },
    listItemSubText: {
        padding: 2,
        fontSize: 17,
        color: palette.grey.shade_900,
    },
    listItemPill: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'gray',
        borderRadius: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 1,
        padding: 20,
        width: '100%',
        borderRadius: 12,
        shadowOffset: {width: 1, height: 1},
    },
    detailsView: {
        flex: 5,
    },
    checkbox: {
        flex: 1,
        alignSelf: 'flex-end',
    },
});