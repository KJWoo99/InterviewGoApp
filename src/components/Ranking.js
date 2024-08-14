import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { BASE_URL } from '@env';

const Ranking = ({ email }) => {
    const [rankings, setRankings] = useState(null);
    const [userPercentage, setUserPercentage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    const fetchRankings = async () => {
        
        try {
            const response = await fetch(`${BASE_URL}/rank/ranklist`);

            if(response.ok){
                const data = await response.json();
                // 서버에서 상위 5명 받아오기
                setRankings(data.slice(0, 5));
            }
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPercentages = async (email) => {
        
        try {
            const response = await fetch(`${BASE_URL}/rank/percentages?email=${email}`);
            
            if(response.ok){
                // 상위 n% 저장
                const data = await response.json();
                setUserPercentage(data.ranking);
                setUsername(data.username)
            }
        } catch (error) {
            
        }
    };

    useEffect(() => {
        if (email) {
            fetchUserPercentages(email);
        }
        fetchRankings();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <Text style={styles.title}>Ranking</Text>
                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.heading}>최고득점자 순위</Text>
                        {rankings && rankings.length > 0 ? (
                            rankings.map((ranking, index) => (
                                <Text key={index} style={styles.rankText}>
                                    {`${ranking.rank}. ${ranking.username}님 (${ranking.max_score}점)`}
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.rankText}>등록된 랭킹 정보가 없습니다. 랭킹에 도전해보세요!</Text>
                        )}
                    </View>
                    <View style={styles.rightContainer}>
                        {userPercentage !== null ? (
                            <>
                                <Text style={styles.userText}>{`${username}`}님은 상위</Text>
                                <Text style={styles.percentageText}>{`${userPercentage}%`}</Text>
                                <Text style={styles.userText}>달성중!</Text>
                            </>
                        ) : (
                            <Text style={styles.userText}>면접 후 상위 퍼센트를 보실 수 있어요:)</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
    },
    leftContainer: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        paddingRight: 10,
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rankText: {
        fontSize: 14,
        marginTop: 5,
    },
    userText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    percentageText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#3777AB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Ranking;