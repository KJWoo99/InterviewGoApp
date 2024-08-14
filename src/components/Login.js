import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, ScrollView, Animated, BackHandler } from 'react-native';
import { RadioButton } from 'react-native-paper';
import commonStyles from '../styles/commonStyles';
import { BASE_URL } from '@env';

// 수정
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigation = useNavigation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const usernameAnim = useRef(new Animated.Value(200)).current;
    const passwordAnim = useRef(new Animated.Value(200)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // 수정
    const { saveToken } = useAuth();

    const animateInputFields = (animations) => {
        animations.forEach((anim, index) => {
            Animated.timing(anim, {
                toValue: 0,
                duration: 300,
                delay: index * 100,
                useNativeDriver: true,
            }).start();
        });
    };

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();

        animateInputFields([
            passwordAnim,
            usernameAnim
        ]);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            setEmail('');
            setPassword('');

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
    // 로그인 - 수정
    const loginUser = async () => {
        
        try {
          const response = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({"username": email, "password": password}).toString()
          });
      
          const result = await response.json();
      
          if (response.ok) {

            await saveToken(result);  // 토큰 저장
            navigation.navigate('Dashboard');  // 로그인 성공 시
          } else {
            alert(result.message || '로그인에 실패했습니다.');
          }
        } catch (error) {
          alert('서버와 통신 중 오류가 발생했습니다.');
        }
      };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.subContainer}>
                <View style={styles.form}>
                    <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                        <Text style={styles.title}>다시 만나서 반가워요!</Text>
                    </Animated.View>
                    <Animated.View style={{ transform: [{ translateX: usernameAnim }] }}>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="이메일주소"
                            placeholderTextColor={'#b3b3b3'}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            required
                        />
                    </Animated.View>
                    <Animated.View style={{ transform: [{ translateX: passwordAnim }] }}>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="비밀번호"
                            placeholderTextColor={'#b3b3b3'}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            required
                        />
                    </Animated.View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={commonStyles.button}
                        title="Login"
                        onPress={loginUser}
                    >
                        <Text style={styles.buttonText}>로그인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={commonStyles.button}
                        onPress={() => navigation.navigate('Signup')}
                    >
                        <Text style={styles.buttonText}>회원가입하기</Text>
                    </TouchableOpacity>
                    <Text style={commonStyles.link} onPress={() => { navigation.navigate('PasswordResend') }}>비밀번호를 잊으셨나요?</Text>
                    <TouchableOpacity>
                        <Text style={commonStyles.link} onPress={() => { navigation.navigate('JuneSttTest') }}>지윤님테스트</Text>
                        <Text style={commonStyles.link} onPress={() => { navigation.navigate('ChaTest') }}>차승현테스트</Text>
                        <Text style={commonStyles.link} onPress={() => { navigation.navigate('KwakTest') }}>곽정우테스트</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 0,
        backgroundColor: 'white',
    },
    subContainer: {
        width: '90%',
        marginHorizontal: 'auto',
        marginTop: 50,
    },  
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 10,
    },
    title: {
        marginBottom: 50,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        borderColor: '#e6e6e6',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },    
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
    },
    buttonText: {
        color: '#777',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },    
})
