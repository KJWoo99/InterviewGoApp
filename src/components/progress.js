import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from '@env';  // 환경 변수에서 BASE_URL 가져오기

const Progress = ({ email, width }) => {
    const [recentInterviews, setRecentInterviews] = useState([]);
    const progressAnim = useRef(new Animated.Value(0)).current;

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width],
    });

    // 최근 면접 기록 가져오기
    const fetchRecentInterviews = async (email) => {
        try {
            const response = await fetch(`${BASE_URL}/chatbot/summaryRecent/${email}`);

            if (response.ok) {
                const result = await response.json();
                setRecentInterviews(result);
            }
        } catch (error) {
            console.error('에러:', error);
            alert('서버 에러');
        }
    };

    const animateProgress = (score) => {
        Animated.timing(progressAnim, {
            toValue: score / 100,  // 점수를 백분율로 변환
            duration: 1000,
            useNativeDriver: false,
        }).start();
    };

    // 컴포넌트 마운트 시 데이터 로딩
    useEffect(() => {
        fetchRecentInterviews(email);
    }, [email]); // email이 변경될 때마다 실행

    // 점수가 변경될 때 애니메이션 실행
    useEffect(() => {
        if (recentInterviews.length > 0) {
            animateProgress(recentInterviews[0].score);
        }
    }, [recentInterviews]);
    

    return (
        <View style={styles.userProgress}>
            {recentInterviews.length > 0 ? (
                <>
                    <Text><Text style={styles.boldText}>최근 본 면접 점수 : <Text style={styles.progressPercentage}>{recentInterviews[0].score}</Text></Text></Text>
                    <Text>잘하고 있어요. 조금만 더 힘내봐요!</Text>
                    <View style={styles.progressBar}>
                        <Animated.View style={[styles.progress, { width: progressWidth }]}>
                            <LinearGradient
                                colors={['#e76868', '#ebeb9b', '#83cfc3']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.progress}
                            />
                        </Animated.View>
                    </View>
                    <View style={styles.progressVal}>
                        <Text>0</Text>
                        <Text>100</Text>
                    </View>
                </>
            ) : (
                <Text style={styles.text2}>최근 본 면접 기록이 없습니다.</Text>
            )}
        </View>
    );
};

const styles = {
    userProgress: {
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderStyle: 'dashed',

    },
    progressBar: {
        width: '100%',
        marginTop: 10,
        height: 20,
        backgroundColor: '#efefef',
        borderRadius: 50,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        backgroundColor: '#83cfc3',
        borderRadius: 50,
        width: '80%', // Assuming 80% progress
    },
    progressVal: {
        fontSize: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2,
        marginBottom: 20,
    },
    progressPercentage: {
        color: '#83cfc3',
        fontWeight: 'bold',
    },
    boldText: {
        fontWeight: 'bold',
    },
    text2: {
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#666',
    }
};

export default Progress;
