import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles'
import { BASE_URL } from '@env';

export default function App() {
    const navigation = useNavigation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 이메일 인증코드 전송
    const sendEmailCode = async () => {
        try {
            const response = await fetch(`${BASE_URL}/email/sendEmailPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ email }).toString()
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
            } else {
                alert('인증코드 전송에 실패했거나, 존재하지 않는 이메일입니다.');
            }
        } catch (error) {
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View style={styles.title}>
                    <Text style={styles.title}>가입 시 기재하신 이메일을 적어주세요.</Text>
                    <Text style={styles.title}>.</Text>
                </View>
                <View style={styles.form}>
                    <View style={styles.formItem}>
                        <TextInput
                            style={styles.input}
                            placeholder="이메일주소"
                            placeholderTextColor={'#b3b3b3'}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            required
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={sendEmailCode}>
                            <Text style={styles.buttonText}>발송</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.btnArea}>
                <TouchableOpacity style={commonStyles.button} onPress={() => { navigation.navigate('Login') }}>
                    <Text style={styles.buttonText}>로그인 화면으로 가기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    subContainer: {
        width: '90%',
        marginTop: '50%',
        marginHorizontal: 'auto',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#efefef',
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 20,
    },
    titleText: {
        lineHeight: 25,
    },
    form: {
        padding: 10,
    },
    formItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fafafa',
        padding: 7,
        borderRadius: 10,
        fontSize: 16,
    },
    sendButton: {
        width: 100,
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    btnArea: {
        width: '90%',
        marginHorizontal: 'auto',
        marginTop: 10,
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 10,
    },
    prevButton: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#777',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});