import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { RadioButton } from 'react-native-paper';
import commonStyles from '../styles/commonStyles';
import { BASE_URL } from '@env';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const navigation = useNavigation();    
    const [email, setEmail] = useState('');
    const [emailCode, setEmailCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [username, setUsername] = useState('');
    const [job, setJob] = useState('');
    const [showJobSelect, setShowJobSelect] = useState(false);
    const [categories, setCategories] = useState({
        management: false,
        salesMarketing: false,
        publicService: false,
        researchDevelopment: false,
        informationTechnology: false,
        design: false,
        productionManagement: false,
    });
    const { saveToken } = useAuth();

    const managementHeight = useRef(new Animated.Value(0)).current;
    const managementRotation = useRef(new Animated.Value(0)).current;

    const salesMarketingHeight = useRef(new Animated.Value(0)).current;
    const salesRotation = useRef(new Animated.Value(0)).current;

    const publicServiceHeight = useRef(new Animated.Value(0)).current;
    const publicServiceRotation = useRef(new Animated.Value(0)).current;

    const researchDevelopmentHeight = useRef(new Animated.Value(0)).current;
    const researchDevelopmentRotation = useRef(new Animated.Value(0)).current;

    const informationTechnologyHeight = useRef(new Animated.Value(0)).current;
    const informationTechnologyRotation = useRef(new Animated.Value(0)).current;

    const designHeight = useRef(new Animated.Value(0)).current;
    const designRotation = useRef(new Animated.Value(0)).current;

    const productionManagementHeight = useRef(new Animated.Value(0)).current;
    const productionManagementRotation = useRef(new Animated.Value(0)).current;


    const emailAnim = useRef(new Animated.Value(200)).current;
    const emailCodeAnim = useRef(new Animated.Value(200)).current;
    const passwordAnim = useRef(new Animated.Value(200)).current;
    const passwordConfirmAnim = useRef(new Animated.Value(200)).current;
    const usernameAnim = useRef(new Animated.Value(200)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const toggleCategory = (category, heightAnim, rotationAnim) => {
        setCategories(prevState => {
            const newState = { ...prevState, [category]: !prevState[category] };
            if (newState[category]) { // 카테고리가 열릴 때
                Animated.timing(heightAnim, {
                    toValue: 100, // 100vh
                    duration: 300,
                    useNativeDriver: false,
                }).start();
                Animated.timing(rotationAnim, {
                    toValue: 1, // 90도로 회전
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            } else {
                Animated.timing(heightAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
                Animated.timing(rotationAnim, {
                    toValue: 0, // 원래 위치로 회전
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }
            return newState;
        });
    };  

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
            emailAnim,
            emailCodeAnim,
            passwordAnim,
            passwordConfirmAnim,
            usernameAnim
        ]);
    }, []);

    const managementRotate = managementRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });
    const salesRotate = salesRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });
    const publicServiceRotate = publicServiceRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });
    const researchDevelopmentRotate = researchDevelopmentRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });
    const informationTechnologyRotate = informationTechnologyRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });
    const designRotate = designRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });
    const productionManagementRotate = productionManagementRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });

    // 이메일 인증코드 전송 - 수정
    const sendEmailCode = async () => {

        try {
            const response = await fetch(`${BASE_URL}/email/sendEmailCode`, {
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
                alert('인증코드 전송에 실패했습니다.');
            }
        } catch (error) {
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };


    // 회원가입정보 서버로 보내기(비밀번호확인, 이메일인증코드확인) - 수정
    const registerUser = async () => {
        if (password !== passwordConfirm) {
            alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        // 비밀번호 4자리 이상 확인
        if (password.length < 4) {
            alert('비밀번호는 4자리 이상으로 설정해주세요.');
            return;
        }

        // 닉네임 1자 이상 확인
        if (username.length < 1) {
            alert('사용할 닉네임을 1자 이상으로 설정해주세요.');
            return;
        }

        // 직무 최소 1가지 선택 확인
        if (!job) {
            alert('직무를 선택해주세요.');
            return;
        }
        
        try {
            const verifystate = await fetch(`${BASE_URL}/email/verifycode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ emailCode }).toString()
            });

            if (!verifystate.ok) {
                alert('인증코드가 일치하지 않습니다!');
                return;
            }
        } catch (error) {
            alert('서버와 통신 중 오류가 발생했습니다.');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    job
                })
            });
            // 이메일 인증코드 불일치 시
            if (response.status === 409) {
                alert('이미 회원 가입 되어있는 이메일입니다.');
                return;
            }

            const result = await response.json();

            if (response.ok) {
                alert("회원 가입이 성공적으로 이루어졌습니다.");
                await saveToken(result);  // 토큰 저장
                navigation.navigate('Dashboard'); // 성공 시 dashboard로 이동
            } else {
                alert(result.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.subContainer}>
        {!showJobSelect ? (
          <View style={styles.form}>
            <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                <Text style={styles.title}>회원님에 대해 알려주세요!</Text>
            </Animated.View>
            <Animated.View style={{ transform: [{ translateX: emailAnim }] }}>
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
            <TouchableOpacity style={commonStyles.button} onPress={sendEmailCode}>
                <Text style={styles.buttonText}>이메일 인증코드전송</Text>
            </TouchableOpacity>
            <Animated.View style={{ transform: [{ translateX: emailCodeAnim }] }}>
                <TextInput
                    style={commonStyles.input}
                    placeholder="인증코드입력"
                    placeholderTextColor={'#b3b3b3'}
                    value={emailCode}
                    onChangeText={setEmailCode}
                />
            </Animated.View>
            <View style={commonStyles.hr2} />
            <Animated.View style={{ transform: [{ translateX: passwordAnim }] }}>
                <TextInput
                    style={commonStyles.input}
                    placeholder="비밀번호(4자리 이상)"
                    placeholderTextColor={'#b3b3b3'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </Animated.View>
            <Animated.View style={{ transform: [{ translateX: passwordConfirmAnim }] }}>
                <TextInput
                    style={commonStyles.input}
                    placeholder="비밀번호확인"
                    placeholderTextColor={'#b3b3b3'}
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    secureTextEntry
                />
            </Animated.View>
            <View style={commonStyles.hr2} />  
            <Animated.View style={{ transform: [{ translateX: usernameAnim }] }}>          
                <TextInput
                    style={commonStyles.input}
                    placeholder="사용할 닉네임(1자 이상의 한글 또는 영문)"
                    placeholderTextColor={'#b3b3b3'}
                    value={username}
                    onChangeText={setUsername}
                />
            </Animated.View>
            <TouchableOpacity style={commonStyles.button} onPress={() => setShowJobSelect(true)} >
                <Text style={styles.buttonText}>다 음</Text>
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.button} onPress={() => { navigation.navigate('Login') }} >
                <Text style={[styles.link, styles.buttonText]}>이미 계정이 있어요</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                <Text style={styles.title}>어떤 분야에 관심이 있나요?</Text>
            </Animated.View>
            <Text>나중에 변경 가능하니 걱정마세요:)</Text>
            <View style={styles.tree}>
            <TouchableOpacity onPress={() => toggleCategory('management', managementHeight, managementRotation)}>
                <View style={styles.categoryRow}>
                    <Animated.Text style={[styles.categoryToggle, styles.treeText, { transform: [{ rotate: managementRotate }] }]}>{'> '}</Animated.Text>
                    <Text style={styles.treeText}>경영사무</Text>
                </View>
            </TouchableOpacity>
                <Animated.View style={{ height: managementHeight }}>
                    {categories.management && (
                        <View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="insa"
                                    status={job === 'insa' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('insa')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>인사관리</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="finance"
                                    status={job === 'finance' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('finance')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>재무관리</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="chongmu"
                                    status={job === 'chongmu' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('chongmu')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>총무관리</Text>
                            </View>
                        </View>
                    )}
                </Animated.View>
                <TouchableOpacity onPress={() => toggleCategory('salesMarketing', salesMarketingHeight, salesRotation)}>
                <View style={styles.categoryRow}>
                    <Animated.Text style={[styles.categoryToggle, styles.treeText, { transform: [{ rotate: salesRotate }] }]}>{'> '}</Animated.Text>
                    <Text style={styles.treeText}>영업마케팅</Text>
                </View>
                </TouchableOpacity>
                <Animated.View style={{ height: salesMarketingHeight }}>
                    {categories.salesMarketing && (
                        <View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="sales"
                                    status={job === 'sales' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('sales')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>영업관리</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="marketing"
                                    status={job === 'marketing' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('marketing')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>마케팅전략</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="customer"
                                    status={job === 'customer' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('customer')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>고객관리</Text>
                            </View>
                        </View>
                    )}
                </Animated.View>
                <TouchableOpacity onPress={() => toggleCategory('publicService', publicServiceHeight, publicServiceRotation)}>
                <View style={styles.categoryRow}>
                    <Animated.Text style={[styles.categoryToggle, styles.treeText, { transform: [{ rotate: publicServiceRotate }] }]}>{'> '}</Animated.Text>
                    <Text style={[styles.categoryToggle, styles.treeText]}>공공서비스</Text>
                </View>
                </TouchableOpacity>
                <Animated.View style={{ height: publicServiceHeight }}>
                    {categories.publicService && (
                        <View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="haengjung"
                                    status={job === 'haengjung' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('haengjung')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>행정관리</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="society"
                                    status={job === 'society' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('society')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>사회복지</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="gonggong"
                                    status={job === 'gonggong' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('gonggong')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>공공안전</Text>
                            </View>
                        </View>
                    )}
                </Animated.View>
                <TouchableOpacity onPress={() => toggleCategory('researchDevelopment', researchDevelopmentHeight, researchDevelopmentRotation)}>
                    <View style={styles.categoryRow}>
                    <Animated.Text style={[styles.categoryToggle, styles.treeText, { transform: [{ rotate: researchDevelopmentRotate }] }]}>{'> '}</Animated.Text>
                        <Text style={[styles.categoryToggle, styles.treeText]}>연구개발</Text>
                    </View>
                </TouchableOpacity>
                <Animated.View style={{ height: researchDevelopmentHeight }}>
                    {categories.researchDevelopment && (
                        <View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="product"
                                    status={job === 'product' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('product')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>제품개발</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="technology"
                                    status={job === 'technology' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('technology')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>기술연구</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="clinical"
                                    status={job === 'clinical' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('clinical')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>임상연구</Text>
                            </View>
                        </View>
                    )}
                </Animated.View>
                <TouchableOpacity onPress={() => toggleCategory('informationTechnology', informationTechnologyHeight, informationTechnologyRotation)}>
                    <View style={styles.categoryRow}>
                        <Animated.Text style={[styles.categoryToggle, styles.treeText, { transform: [{ rotate: informationTechnologyRotate }] }]}>{'> '}</Animated.Text>
                        <Text style={[styles.categoryToggle, styles.treeText]}>정보통신</Text>
                    </View>
                </TouchableOpacity>
                <Animated.View style={{ height: informationTechnologyHeight }}>
                    {categories.informationTechnology && (
                        <View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="network"
                                    status={job === 'network' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('network')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>네트워크관리</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="software"
                                    status={job === 'software' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('software')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>소프트웨어개발</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="security"
                                    status={job === 'security' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('security')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>정보보안</Text>
                            </View>
                        </View>
                    )}
                </Animated.View>
                <TouchableOpacity onPress={() => toggleCategory('design', designHeight, designRotation)}>
                    <View style={styles.categoryRow}>
                        <Animated.Text style={[styles.categoryToggle, styles.treeText, { transform: [{ rotate: designRotate }] }]}>{'> '}</Animated.Text>
                        <Text style={[styles.categoryToggle, styles.treeText]}>디자인</Text>
                    </View>
                </TouchableOpacity>
                <Animated.View style={{ height: designHeight }}>
                    {categories.design && (
                        <View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="graphicDsgn"
                                    status={job === 'graphicDsgn' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('graphicDsgn')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>그래픽디자인</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="uxuiDsgn"
                                    status={job === 'uxuiDsgn' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('uxuiDsgn')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>UX/UI디자인</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="productDsgn"
                                    status={job === 'productDsgn' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('productDsgn')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>제품디자인</Text>
                            </View>
                        </View>
                    )}
                </Animated.View>
                <TouchableOpacity onPress={() => toggleCategory('productionManagement', productionManagementHeight, productionManagementRotation)}>
                    <View style={styles.categoryRow}>
                        <Animated.Text style={[styles.categoryToggle, styles.treeText, { transform: [{ rotate: productionManagementRotate }] }]}>{'> '}</Animated.Text>
                        <Text style={[styles.categoryToggle, styles.treeText]}>생산관리</Text>
                    </View>
                </TouchableOpacity>
                <Animated.View style={{ height: productionManagementHeight }}>
                    {categories.productionManagement && (
                        <View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="saengsan"
                                    status={job === 'saengsan' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('saengsan')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>생산계획</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="qa"
                                    status={job === 'qa' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('qa')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>품질관리</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="process"
                                    status={job === 'process' ? 'checked' : 'unchecked'}
                                    onPress={() => setJob('process')}
                                    uncheckedColor='#999'
                                    color="#777"
                                />
                                <Text style={styles.treeText2}>공정관리</Text>
                            </View>
                        </View>
                    )}      
                </Animated.View>                                                                       
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={commonStyles.button} onPress={() => setShowJobSelect(false)} >
                    <Text style={styles.buttonText}>이전화면</Text>
                </TouchableOpacity>
                <TouchableOpacity style={commonStyles.button} onPress={registerUser} >
                    <Text style={styles.buttonText}>가입하기</Text>
                </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
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
  hr: {
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1,
    marginVertical: 10,
    width: '100%',
    borderStyle: 'dashed',
  },
  link: {
    color: 'blue',
    textAlign: 'center',
  },
  tree: {
    listStyleType: 'none',
    maxHeight: '40vh',
    overflowY: 'auto',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
    fontSize: 18,
  },
  treeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  treeText2: {
    fontSize: 16,
    marginBottom: 5,
  },  
  categoryToggle: {
    display: 'flex',
    alignItems: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
});