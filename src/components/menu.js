import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Menu = ({ onClose }) => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const menuTranslateY = useRef(new Animated.Value(0)).current;
    const backgroundOpacity = useRef(new Animated.Value(0)).current;
    const { width } = Dimensions.get('window');

    return (
        <View style={styles.menuContainer}>
            <Animated.View 
                style={[
                styles.overlay, 
                { 
                    opacity: backgroundOpacity,
                    display: menuVisible ? 'flex' : 'none'
                }
                ]} 
            />
            <Animated.View style={[styles.menu, { transform: [{ translateY: menuTranslateY }] }]}>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuItemText} onPress={() => {navigation.navigate('Dashboard')}}>홈으로</Text>
                    <Image source={require('../assets/images/icons/home.png')} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuItemText}>메모장</Text>
                    <Image source={require('../assets/images/icons/menu-memo.png')} style={styles.menuIcon2} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuItemText} onPress={() => { navigation.navigate('Settings') }}>회원정보수정</Text>
                    <Image source={require('../assets/images/icons/menu-settings.png')} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuItemText} onPress={() => { navigation.navigate('SetInterview') }}>면접보기</Text>
                    <Image source={require('../assets/images/icons/menu-mic.png')} style={styles.menuIcon} />
                </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity onPress={menuToggle} style={styles.interviewButton}>
                <Image source={require('../assets/images/icons/peeps-avatar-iljob.png')} style={styles.interviewButtonImage} />
            </TouchableOpacity>
        </View>
    );
};

export default Menu;

const styles = StyleSheet.create({
    menuContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    menu: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        backgroundColor: 'transparent',
        borderRadius: 10,
        padding: 10,
        zIndex: 2,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E8EAED',
        textAlign: 'right',
        marginRight: 10,
    },
    menuIcon: {
        width: 30,
        height: 30,
        opacity: 0.9,
    },
    menuIcon2: {
        width: 25,
        height: 25,
        opacity: 0.9,
    },
});


