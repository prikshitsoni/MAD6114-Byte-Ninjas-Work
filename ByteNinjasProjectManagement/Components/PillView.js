import palette from 'google-material-color-palette-json';
import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';

export default function PillView({ status }) {
    const pillColor = () => {
        switch (status) {
            case 'In Progress':
                return palette.grey.shade_300;
            case 'Complete':
                return palette.green.shade_400;
            default:
                return palette.grey.shade_300;
        }
    };

    const textColor = () => {
        switch (status) {
            case 'In Progress':
                return palette.grey.shade_800;
            case 'Complete':
                return 'white';
            default:
                return palette.grey.shade_800;
        }
    }

    return (
        <View style={[styles.listItemPill, { backgroundColor: pillColor() }]}>
            <Text style={[styles.pillText, { color: textColor() }]}>In Progress</Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
});