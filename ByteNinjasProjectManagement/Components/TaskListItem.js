import palette from 'google-material-color-palette-json';
import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card} from 'react-native-shadow-cards';

import PillView from './PillView';

export default function TaskListItem({task, onPress}) {
    return(
        <TouchableOpacity style={styles.listItem} onPress={() => onPress()}>
            <Card style={styles.card}>
                <View style={styles.listItemHeader}>
                    <Text numberOfLines={2} style={styles.listItemText}>{task.name}</Text>
                    <PillView status={ task.status }/>
                </View>
                {
                    task.assignedUser.email &&
                    <Text style={styles.listItemSubText}>{ task.assignedUser.firstName } { task.assignedUser.lastName }</Text>
                }
                {
                    task.assignedUser.email &&
                    <Text style={styles.listItemSubText}>${ task.assignedUser.hourlyRate } / hour</Text>
                }
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
    listItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    listItemText: {
        fontSize: 22,
        fontWeight: '600',
        color: palette.grey.shade_900,
        padding: 2,
        marginRight: 8,
        maxWidth: '60%'
    },
    listItemSubText: {
        padding: 2,
        fontSize: 17,
        color: palette.grey.shade_900,
    },
    listItemPill: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 6,
        paddingBottom: 6,
        backgroundColor: palette.grey.shade_300,
        borderRadius: 20,
        maxWidth: 115,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillText: {
        fontWeight: '700',
        color: palette.grey.shade_800,
    },
    card: {
        elevation: 1,
        padding: 20,
        width: '100%',
        borderRadius: 12,
        shadowOffset: {width: 1, height: 1},
    },
});