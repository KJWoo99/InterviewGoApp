import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Footer = () => {
    return (
        <View style={styles.footer}>
            <Text style={styles.copyright}>TEAM H.I. 2024. All right reserved.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        alignItems: 'center',
    },
    copyright: {
        // position: 'absolute',
        bottom: 10,
        color: '#999',
        fontSize: 12,
    },
})

export default Footer;
