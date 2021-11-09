import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

export default function CustomActivityIndicator() {
    return (
        <View style={styles.loadingIndicator}>
            <View style={styles.indicatorBackground}>
                <ActivityIndicator size="large" color="white"/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    indicatorBackground: {
        width: 80,
        height: 80,
        backgroundColor: 'black',
        opacity: 0.3,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingIndicator: {
        zIndex: 99999,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
      }
});