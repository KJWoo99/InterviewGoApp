import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Animated, Easing, Dimensions, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../styles/commonStyles';
import Recruitment from './Recruitment';
import Ranking from './Ranking';
import Progress from './progress';
import Footer from './Footer';
import { BASE_URL } from '@env';

// 수정
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const Dashboard = () => {
    const navigation = useNavigation();
    const [reloadKey, setReloadKey] = useState(0);
    const [myMenuVisible, setMyMenuVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const animationValue = useRef(new Animated.Value(0)).current;
    const myAnimationValue = useRef(new Animated.Value(0)).current;
    const menuAnimationValue = useRef(new Animated.Value(0)).current;
    
    const [recentInterviews, setRecentInterviews] = useState([]);

    // 수정
    const [userData, setUserData] = useState({});

    // 수정
    const { token, removeToken } = useAuth(); 

    const menuToggle = () => {
        setMenuVisible(!menuVisible);
        Animated.timing(menuAnimationValue, {
            toValue: menuVisible ? 0 : 1,
            duration: 100,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    const menuTranslateY = menuAnimationValue.interpolate({ 
        inputRange: [0, 1],
        outputRange: [400, 0],
    });

    const backgroundOpacity = menuAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.8],
    });


    // 토큰 복호화 및 사용자 정보 가져오는 통신 - 수정
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
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    }

    // 최근 면접 기록 가져오기
    const fetchRecentInterviews = async () => {

        try {
          const response = await fetch(`${BASE_URL}/chatbot/summaryRecent/${userData.email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
        });
      
          if (response.ok) {
            const result = await response.json();
            setRecentInterviews(result); // 서버에서 받은 데이터를 상태에 저장
          } else {
            alert(result.message || '면접 기록을 가져오는 데 실패했습니다.');
          }
        } catch (error) {
          alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    // 로그아웃
    const logout = async () => {

        try {
            const response = await fetch(`${BASE_URL}/user/me`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.token_type} ${token.token}`
                }
            });
            if (response.ok) {
                removeToken();
                navigation.navigate('Login');
            } else {
                alert('로그아웃에 실패했습니다.');
            }
        } catch (error) {
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            if (userData.email) {
                console.log('실행!')
                fetchRecentInterviews();
            }
            setReloadKey(prevKey => prevKey + 1);
            setMenuVisible(false);
            setMyMenuVisible(false);
            Animated.timing(menuAnimationValue, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            }).start();
            Animated.timing(myAnimationValue, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            }).start();

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [userData.email])
    );

    const renderItem = ({ item }) => {
        switch (item.type) {
            case 'header':
                return (
                    <View style={styles.dashHeader}>
                        <View style={styles.dashHeader2}>
                            <View style={styles.dashHeaderImg}>
                                <Image source={require('../assets/images/icons/peeps-avatar.png')} style={styles.headerImage} />
                            </View>
                            <Text style={styles.userInfo}>{userData.username}님, 반가워요!</Text>
                        </View>
                    </View>
                );
            case 'progress':
                return (<Progress key={reloadKey} email={userData.email} width={width} />);
            case 'ranking':
                return (
                    <View style={styles.rankingContainer}>
                        <Ranking key={reloadKey} username={userData.username} email={userData.email} />
                    </View>
                );
            case 'interviewLog':
                return (
                    <View style={styles.dashInterviewLog}>
                        <View>
                            <TouchableOpacity style={styles.button3} onPress={() => { navigation.navigate('SetInterview') }}>
                                <Image source={require('../assets/images/icons/menu-mic.png')} style={styles.mic3Small} />
                                <Text style={styles.button3Text}>면접보러가기</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.logHeader}>
                            <Text style={styles.boldText2}>나의 면접 기록</Text>
                        </View>
                        <View style={styles.logContainer}>
                            {recentInterviews.map((interview, index) => (
                                <View key={index} style={styles.logItem}>
                                    <Image source={require('../assets/images/icons/mic3.png')} style={styles.mic3} />
                                    <View style={styles.logContent}>
                                        <Text style={styles.logItemTitle}>제목: {interview.title}</Text>
                                        <Text>점수: {interview.score}</Text>
                                        <Text>날짜: {interview.createdAt}</Text>
                                    </View>
                                </View>
                            ))}
                            <TouchableOpacity style={styles.button2} onPress={() => { navigation.navigate('Logs', { email: userData.email }) }}>
                                <Text style={styles.buttonText} >전체 기록 보기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 'recruitment':
                return <Recruitment />;
            case 'footer':
                return <Footer />;
            default:
                return null;
        }
    };

    const data = [
        { type: 'header' },
        { type: 'progress' },
        { type: 'ranking' },
        { type: 'interviewLog' },
        { type: 'recruitment' },
        { type: 'footer' },
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.dashSubContainer}
            />
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
                <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('SetInterview') }}>
                    <Text style={styles.menuItemText} >면접보기</Text>
                    <Image source={require('../assets/images/icons/menu-mic.png')} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Logs', { email: userData.email }) }}>
                    <Text style={styles.menuItemText}>기록보기</Text>
                    <Image source={require('../assets/images/icons/menu-record.png')} style={styles.menuIcon2} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Settings', { userData: userData }) }}>
                    <Text style={styles.menuItemText} >회원정보수정</Text>
                    <Image source={require('../assets/images/icons/menu-settings.png')} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={logout}>
                    <Text style={styles.menuItemText} >로그아웃</Text>
                    <Image source={require('../assets/images/icons/menu-logout.png')} style={styles.menuIcon} />
                </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity onPress={menuToggle} style={styles.interviewButton}>
                <Image source={require('../assets/images/icons/peeps-avatar-iljob.png')} style={styles.interviewButtonImage} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        overflow: 'hidden',
        backgroundColor: '#f1f1f1',
    },
    dashContainer: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    dashSubContainer: {
        width: '90%',
        marginTop: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: 100,
    },
    dashHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dashHeader2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dashHeaderImg: {
        marginRight: 10,
    },
    headerImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#999',
    },
    menuIcon: {
        width: 20,
        height: 20,
        opacity: 0.5,
        padding: 10,
        borderRadius: 50,
        borderWidth: 1,
        // borderColor: '#999',
    },
    userInfo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#668DC0',
    },
    dashHeaderSettings: {
        position: 'relative',
    },
    mypageMenu: {
        position: 'absolute',
        top: 40,
        right: 10,
        backgroundColor: 'white',
        boxShadow: '0 1px 8px rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        zIndex: 1,
    },
    myMenuItem: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },  
    menuSeparator: {
        marginVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
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
    rankingContainer: {
        width: '100%',
    },
    dashInterviewLog: {
        marginBottom: 15,
    },
    logHeader: {
        marginBottom: 10,
        marginTop: 10,
    },
    logContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        borderTop: 1,
        borderTopColor: '#ccc',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderStyle: 'dashed',
    },
    logItem: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    logItemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    button2: {
        width: '100%',
        marginBottom: 20,
        fontFamily: 'Noto Sans KR',
        fontSize: 19.2,
        fontWeight: 'bold',
        color: '#777',
        marginVertical: 0,
        backgroundColor: '#e6e6e6',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        outline: 'none',
    },
    button3: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 20,
        fontFamily: 'Noto Sans KR',
        marginVertical: 0,
        backgroundColor: '#668DC0',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 10,
        padding: 15,
        outline: 'none',
    },
    button3Text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
    boldText2: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    buttonText: {
        color: '#777',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mic3: {
        width: 40,
        height: 40,
    },
    mic3Small: {
        width: 30,
        height: 30,
        marginRight: 5,
    },
    logContent: {
        marginLeft: 15,
    },
    dashContentRecruit: {
        marginBottom: 15,
    },
    recruitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 5,
    },
    recruitList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    recruitItem: {
        borderWidth: 1,
        borderColor: '#e6e6e6',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        flexBasis: '48%',
        boxSizing: 'border-box',
        boxShadow: '0 1px 8px rgba(0, 0, 0, 0.1)',
    },
    adSection: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginBottom: 5,
        padding: 10,
    },
    adSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 5,
        padding: 10,
    },
    adSectionContent: {
        alignItems: 'center',
        marginBottom: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        backgroundColor: '#efefef',
        borderRadius: 5,
    },
    interviewStartSection: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        padding: 10,
    },
    btnInterviewArea: {
        margin: 10,
    },
    interviewButtonText: {
        color: '#fff',
        fontSize: 24,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
        zIndex: 1,
      },
    menu: {
        position: 'absolute',
        bottom: 90,
        right: 20,
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
        width: 28,
        height: 28,
        opacity: 0.9,
    },
    interviewButton: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: '#304A6E',
        borderWidth: 3,
        borderColor: '#E8EAED',
        position: 'absolute',
        bottom: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
    interviewButtonImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
});

export default Dashboard;