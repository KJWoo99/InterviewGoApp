import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import TypeWriter from 'react-native-typewriter';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IndexScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const forFadeAnim = useRef(new Animated.Value(0)).current;
    const growthFadeAnim = useRef(new Animated.Value(50)).current;

    const handleFocusEffect = useCallback(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1900,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.delay(800),
                Animated.parallel([
                    Animated.timing(forFadeAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.delay(50),
                Animated.parallel([
                    Animated.timing(growthFadeAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        ]).start();

        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start(async () => {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }).start(() => {
                        navigation.navigate('Dashboard');
                    });
                } else {
                    navigation.navigate('Login');
                }
            });
        }, 4000);
    }, [fadeAnim, slideAnim, forFadeAnim, growthFadeAnim, navigation]);

    useFocusEffect(handleFocusEffect);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoI}>i</Text>
                    <View style={styles.textContainer}>
                        <TypeWriter
                            typing={1}
                            maxDelay={10}
                            style={styles.logoText}
                        >
                            nterview GO
                        </TypeWriter>
                        <Animated.Text
                            style={[
                                styles.logoFor,
                                {
                                    opacity: forFadeAnim,
                                    transform: [{ translateX: slideAnim }]
                                }
                            ]}
                        >
                            for
                        </Animated.Text>
                        <Animated.Text
                            style={[
                                styles.logoGrowth,
                                {
                                    opacity: forFadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            Your Growth :)
                        </Animated.Text>
                    </View>
                </View>
            </Animated.View>
            <Text style={styles.copyright}>TEAM H.I. 2024. All right reserved.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#304A6E',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        marginTop: '60%',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    logoI: {
        fontSize: 150,
        fontWeight: 'bold',
        color: '#668DC0',
        lineHeight: 150,
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 25,  // 'nterview Lab'과 'for' 사이의 간격 증가
    },
    logoText: {
        fontSize: 33,
        color: '#FFFFFF',
        fontWeight: 'bold',
        lineHeight: 36,
    },
    logoFor: {
        fontSize: 24,
        color: '#C0D0EF',
        lineHeight: 24,
        marginLeft: 20,
    },
    logoGrowth: {
        fontSize: 24,
        color: '#C0D0EF',
        lineHeight: 24,
        marginLeft: 40,
    },
    copyright: {
        position: 'absolute',
        bottom: 10,
        color: '#C0D0EF',
        fontSize: 12,
    },
});

export default IndexScreen;