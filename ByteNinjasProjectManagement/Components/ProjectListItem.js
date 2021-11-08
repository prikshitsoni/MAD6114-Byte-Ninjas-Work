import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card} from 'react-native-shadow-cards';

export default function ProjectListItem({project, onPress}) {
    return(
        <TouchableOpacity style={styles.listItem} onPress={() => onPress()}>
            <Card style={styles.card}>
                <Text style={styles.listItemText}>{project.name}</Text>
                <Text style={styles.listItemSubText}>{project.tasks.length} Tasks</Text>
                <Text style={styles.listItemSubText}>{project.members.length} Members</Text>
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
        padding: 2,
    },
    listItemSubText: {
        padding: 2,
        fontSize: 17,
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
        elevation: 1,
        padding: 20,
        width: '100%',
        borderRadius: 12,
        shadowOffset: {width: 1, height: 1},
    },
});