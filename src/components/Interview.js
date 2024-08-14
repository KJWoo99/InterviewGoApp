import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, PermissionsAndroid } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Voice from 'react-native-voice';
import commonStyles from '../styles/commonStyles';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '@env';

const Interview = () => {
    const navigation = useNavigation();
    const scrollViewRef = React.useRef();
    const route = useRoute();
    const { selectedJob, interviewTitle } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);         // 질문과 답변 목록
    const [inputText, setInputText] = useState('');                 // 음성 인식 결과
    const [questionIndex, setQuestionIndex] = useState(0);          // 질문 번호
    const [currentQuestion, setCurrentQuestion] = useState('');     // 현재 질문
    const [summary, setSummary] = useState(null);                   // 면접 결과
    const [additionalCount, setAdditionalCount] = useState(0);      // 추가 질문 수
    const [userData, setUserData] = useState({});                   // 사용자 정보
    const { token } = useAuth();                                    // 사용자 토큰

    const MINIMUM_LENGTH = 60000;
    const SILENCE_LENGTH = 3000;

    const isListening = useRef(false);
    const entire = useRef(''); // 녹음된 전체 텍스트
    const partial = useRef(''); // 녹음된 부분 텍스트
    const [buttonImg, setButtonImg] = useState(require('../assets/images/icons/mic_default.png'));

    const fetchUserData = async () => {
        try{
            const response = await fetch(`${BASE_URL}/user/me`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.token_type} ${token.token}`
                }
            })
            const result = await response.json();
            setUserData(result);
        } catch (error) {
            Alert.alert('서버와 통신 중 오류가 발생했습니다.');
        }
    }

    const questions = [
        "먼저 자기소개 부탁드리겠습니다.",
        "본인의 강점에 대해 설명해 주세요.",
        "이 회사에 지원한 이유를 말씀해 주세요.",
        "최근에 해결한 어려운 상황에 대해 이야기해 주세요."
    ];

    useEffect(() => {
        fetchUserData()
        setTimeout(() => {
            setLoading(false);
            setCurrentQuestion(questions[0]);
            setConversations([{
                question: questions[0],
                answer: '',
                position: selectedJob,
                is_additional_question: false,
                additional_count: 0
            }]);
            setModalVisible(true);
        }, 3000)
    }, []);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [conversations]);

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
    
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    useEffect(() => { // 음성 인식 결과가 업데이트 될 때마다 실행
        console.log('updated inputText:', inputText);
        if (inputText !== '') {
            handleSend();
        }
    }, [inputText]);

    const onSpeechStart = (e) => { // 음성인식 시작시 최초 1회 호출
        console.log('onSpeechStart');
        entire.current += partial.current; 
        partial.current = ''; 
    };
  
    const onSpeechEnd = (e) => {
        console.log('Speech recognition ended');
        partial.current = '';
    };

    const onSpeechError = (e) => {
        console.log(JSON.stringify(e.error));
        setState(false);
    };

    const onSpeechPartialResults = (e) => {
        console.log('onSpeechPartialResults:', e.value[0]);
        if (e.value != null && e.value.length > 0) {
            partial.current = e.value[0];
        }
    };

    const onSpeechResults = (e) => {
        console.log('onSpeechResults:', e.value[0]);
        if (e.value != null && e.value.length > 0) { // 음성 인식 결과가 있으면
            setInputText(e.value[0]); // 결과를 state에 저장
        } else {
            entire.current += partial.current; // 결과가 없으면 부분 텍스트를 전체 텍스트에 추가
            setInputText(entire.current); // 전체 텍스트를 state에 저장
        }
        setState(false); // 음성 인식 종료
    };

    const setState = (listening) => {
        setButtonImg(listening ? require('../assets/images/icons/mic_red.png') : require('../assets/images/icons/mic_default.png'));
        isListening.current = listening;
    }

    const toggleListening = () => {
        setState(!isListening.current);
        if (isListening.current) {
            startRecognizing();
        } else {
            stopRecognizing();
        }
    }

    const startRecognizing = async () => {
        console.log('startRecognizing');
        setInputText('');
        entire.current = '';
        partial.current = '';

        try {
            await Voice.start('ko-KR', {
                EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: MINIMUM_LENGTH,
                EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: SILENCE_LENGTH,
            });
        } catch (e) {
            console.error(e);
        }
    };

    const stopRecognizing = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };
  
    const handleSend = async () => {
        console.log('handleSend 실행!', inputText) 

        if (!inputText.trim() === '') {
            Alert.alert('아무 대답도 하지 않았습니다. 다시 해주시기 바랍니다.');
            return;
        }

        if (inputText.length < 5) {
            Alert.alert('답변이 너무 짧습니다. 구체적으로 말씀해 주세요.');
            return;
        }

        const newConversations = conversations.map(conv =>
            conv.question === currentQuestion && conv.answer === ''
                ? { ...conv, answer: inputText }
                : conv
        );

        setConversations(newConversations);

        const lastConversation = newConversations[newConversations.length - 1];

        try {
            const response = await fetch(`${BASE_URL}/chatbot/bot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lastConversation)
            });

            const result = await response.json();

            if (response.ok) {
                if (result.question) {
                    const newQuestion = result.question;
                    setCurrentQuestion(newQuestion);
                    setAdditionalCount(additionalCount + 1);
                    setConversations(prev => [...prev, {
                        question: newQuestion,
                        answer: '',
                        position: selectedJob,
                        is_additional_question: result.is_additional_question,
                        additional_count: result.additional_count
                    }]);
                } else {
                    const newIndex = questionIndex + 1;
                    if (newIndex < questions.length) {
                        const newQuestion = questions[newIndex];
                        setCurrentQuestion(newQuestion);
                        setQuestionIndex(newIndex);
                        setAdditionalCount(0);
                        setConversations(prev => [...prev, {
                            question: newQuestion,
                            answer: '',
                            position: selectedJob,
                            is_additional_question: false,
                            additional_count: 0
                        }]);
                    } else {
                        const summaryResponse = await fetch(`${BASE_URL}/chatbot/summary`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ title: interviewTitle, conversations: newConversations, result: null, username: userData.username, email: userData.email, createdAt: null })
                        });
                        const summaryResult = await summaryResponse.json();

                        setSummary(summaryResult);
                        Alert.alert('모든 질문이 끝났습니다. 결과 확인 후, 좌측상단 < 버튼을 누르세요.');
                    }
                }
                setInputText('');
            } else {
                Alert.alert(result.message || '면접을 진행하는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    const handleBack = () => {
        navigation.navigate('Dashboard');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Image source={require('../assets/images/icons/peeps-avatar-iljob.png')} style={styles.loadingAvatar} />
                <Text style={styles.loadingText}>면접 준비 중입니다. 잠시만 기다려주세요 :)</Text>
                <View style={styles.tip}>
                    <Text style={styles.tipTitle}>Tip</Text>
                    <Text>면접 전에는 자기소개서에 적힌 내용을 잘 숙지해 두세요.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                        {'※ 면접을 시작합니다. ※\n\n' +
                        '1. 하단의 마이크 버튼을 누르고 질문에 대한 답변을 녹음해주세요.\n' +
                        '2. 녹음 완료 시 마이크 버튼을 다시 누르면 전송됩니다.\n' +
                        '3. 1~2분내로 답변해 주시되, 막힘 없이 답변할 수 있도록 해 주세요.\n' +
                        '4. 답변이 너무 짧을 경우 평가가 제대로 되지 않으니 신중히 대답해 주세요.\n'}
                        </Text>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.chatHeader}>
                <TouchableOpacity onPress={handleBack}>
                    <Image source={require('../assets/images/icons/menu-back-white.png')} style={styles.menuIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>{interviewTitle}(질문 번호: {questionIndex + 1}-{additionalCount}/{questions.length})</Text>
            </View>
            <ScrollView style={styles.chatContainer} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
                {conversations.map((conv, index) => (
                    <View key={index} style={styles.speechSection}>
                        <View style={styles.questionSection}>
                            <Image source={require('../assets/images/icons/peeps-avatar-iljob.png')} style={styles.avatar} />
                            <View style={styles.speechBubbleLeft}>
                                <Text style={styles.conv}>{conv.question}</Text>
                                <View style={styles.speechBubbleLeftPointer} />
                            </View>
                        </View>
                        {conv.answer && (
                            <View style={styles.speechBubbleRight}>
                                <Text style={styles.conv}>{conv.answer}</Text>
                                <View style={styles.speechBubbleRightPointer} />
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            {summary && (
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>면접 결과</Text>
                    <Text style={styles.summaryText}>총점: <Text style={{ color: summary.score >= 70 ? 'green' : 'red' }}>{summary.score}점</Text></Text>
                    <Text style={styles.summaryText}>강점 평가: {summary.strengths}</Text>
                    <Text style={styles.summaryText}>약점 평가: {summary.weaknesses}</Text>
                    <Text style={styles.summaryText}>화법 평가: {summary.delivery}</Text>
                    <Text style={styles.summaryText}>총 평가: {summary.total}</Text>
                </View>
            )}
            <View style={styles.recordSection}>
                <TouchableOpacity onPress={toggleListening} disabled={summary !== null}>
                    <Image
                        source={buttonImg} style={styles.micButton}  
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#668DC0',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#668DC0',
    },
    loadingAvatar: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 18,
        color: '#C0D0EF',
        textAlign: 'center',
        marginBottom: 20,
    },
    tip: {
        backgroundColor: '#e6e6e6',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    tipTitle: {
        fontWeight: 'bold',
    },
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    speechSection: {
        marginBottom: 10,
    },
    questionSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    conv: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    speechBubbleLeft: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        maxWidth: '80%',
    },
    speechBubbleLeftPointer: {
        position: 'absolute',
        left: -8,
        top: 10,
        width: 0,
        height: 0,
        borderTopWidth: 5,
        borderTopColor: 'transparent',
        borderBottomWidth: 5,
        borderBottomColor: 'transparent',
        borderRightWidth: 10,
        borderRightColor: '#fff',
    },
    speechBubbleRight: {
        backgroundColor: '#C0D0EF',
        marginTop: 10,
        borderRadius: 15,
        padding: 10,
        maxWidth: '80%',
        marginLeft: 70,
    },
    speechBubbleRightPointer: {
        position: 'absolute',
        right: -8,
        top: 10,
        width: 0,
        height: 0,
        borderTopWidth: 5,
        borderTopColor: 'transparent',
        borderBottomWidth: 5,
        borderBottomColor: 'transparent',
        borderLeftWidth: 10,
        borderLeftColor: '#C0D0EF',
    },
    recordSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#668DC0',
        marginBottom: 10,
    },
    inputText: {
        flex: 1,
        padding: 10,
        marginRight: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 5,
    },
    button2: {
        padding: 10,
        backgroundColor: '#C0D0EF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#668DC0',
        borderRadius: 25,
        marginRight: 10,
    },
    micIcon: {
        width: 30,
        height: 30,
    },
    summaryContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 16,
        marginBottom: 5,
    },
    modalView: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '50%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        whiteSpace: 'pre-line',
      },
      closeButton: {
        backgroundColor: '#668DC0',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
      },
      closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      buttonText2: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      chatHeader: {
        position: 'fixed',
        width: '100%',
        top: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 50,
        backgroundColor: '#668DC0',
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        position: 'absolute', 
        left: 50, 
        right: 50,
    },
    menuIcon: {
        width: 30,
        height: 30,
        opacity: 0.5,
        marginLeft: 10,
    },
});

export default Interview;