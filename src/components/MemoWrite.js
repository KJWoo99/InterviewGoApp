import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const MemoWrite = () => {
    const navigation = useNavigation();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

    const uploadPost = async () => {
        if (!title || !content) {
        alert('모든 필드를 채워주세요.');
        return;
        }

        const data = {
        title,
        content,
        uploadTime: new Date(),
        };

        try {
        const response = await axios.post('http://localhost:8080/memo/upload', data, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
        console.log('성공적으로 저장되었습니다', response.data);
        } catch (error) {
        console.error('저장 중 오류가 발생했습니다', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>메모남기기</Text>
                <Text style={styles.notice}>나의 다짐, 할 일 등을 기록해 보세요.</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder="제목"
                placeholderTextColor={'#b3b3b3'}
                value={title}
                onChangeText={setTitle}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                style={styles.textArea}
                placeholder="글쓰기"
                placeholderTextColor={'#b3b3b3'}
                value={content}
                onChangeText={setContent}
                multiline={true}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={uploadPost}>
                <Text style={styles.buttonText}>메모등록</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('Dashboard')}}>
                <Text style={styles.buttonText}>돌아가기</Text>
            </TouchableOpacity>
        </SafeAreaView>
    ); 

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    notice: {
        marginBottom: 20,
    },
        
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        height: 350,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#e6e6e6',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#777',
        fontWeight: 'bold',
    },
});

export default MemoWrite;