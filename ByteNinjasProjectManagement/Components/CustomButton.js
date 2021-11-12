import React from "react";
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function CustomButton({title, onPress, style}) {
    return (
        <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
            <Text style={styles.btnTitle}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        padding: 18,
        backgroundColor: 'darkslateblue',
        minHeight: 50,
        justifyContent: 'center',
        borderRadius: 15,
    },
    btnTitle: {
        color:'white',
        fontSize: 16,
        width: '100%',
        textAlign: 'center',
        fontWeight: '600',
    }
});