import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '@env';
import commonStyles from '../styles/commonStyles';

const Settings = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const { token, removeToken } = useAuth(); 

  const route = useRoute();
  const { userData } = route.params;

  useEffect(() => {
    setUsername(userData.username)
    setPassword(userData.password)
    setPasswordCheck(userData.password)
    setSelectedJob(userData.job)
  }, [userData]);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleJobChange = (job) => {
    setSelectedJob(job);
  };

  // 정보수정하기
  const handleSubmit = async () => {
    if (password !== passwordCheck) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const user = {
      username,
      password,
      job: selectedJob,
    };

    try {
      const response = await fetch(`${BASE_URL}/user/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token.token_type} ${token.token}`
          },
        body: JSON.stringify(user)
      })

      if (response.ok) {
        Alert.alert('정보가 정상적으로 변경되었습니다. 다시 로그인하세요');
        removeToken();
        navigation.navigate('Login');
      } else {
        Alert.alert('회원 정보가 동일하거나 변경에 실패했습니다!');
      }
    } catch (error) {
      Alert.alert('서버 오류', error.message);
    }
  };

  // 회원탈퇴
  const handleDeleteAccount = async () => {

    try {
      const response = await fetch(`${BASE_URL}/user/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token.token_type} ${token.token}`
          },
      })
      if (response.ok) {
        Alert.alert('회원탈퇴가 정상적으로 처리되었습니다.');
        navigation.navigate('Login');
      } else {
        Alert.alert('회원탈퇴에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('서버 오류', error.message);
    }
  };

  const quitUrl = 'https://interviewla6.imweb.me/'; // 회원탈퇴 페이지
  
  const handleCardPress = (url) => {
    console.log('url로 이동:', url);
    navigation.navigate('JobWebView', { url });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>내 정보 관리</Text>
          <Text style={styles.email}>{userData.email}</Text>
          {/* <Text style={styles.email}>{email}</Text> */}
        </View>
        <View style={styles.formContainer}>
          <View style={styles.formItem}>
            <Text>새로운 닉네임</Text>
            <TextInput
              style={commonStyles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="username"
              placeholderTextColor="#b3b3b3"
            />
          </View>
          <View style={styles.formItem}>
            <Text>새 비밀번호</Text>
            <TextInput
              style={commonStyles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="password"
              placeholderTextColor="#b3b3b3"
              secureTextEntry
            />
          </View>
          <View style={styles.formItem}>
            <Text>비밀번호 확인</Text>
            <TextInput
              style={commonStyles.input}
              value={passwordCheck}
              onChangeText={setPasswordCheck}
              placeholder="password-check"
              placeholderTextColor="#b3b3b3"
              secureTextEntry
            />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.title}>직무 변경</Text>
            <View style={styles.tree}>
              {renderCategory('경영사무', [
                { label: '인사관리', value: 'insa' },
                { label: '재무관리', value: 'finance' },
                { label: '총무관리', value: 'chongmu' },
              ])}
              {renderCategory('영업마케팅', [
                { label: '영업관리', value: 'sales' },
                { label: '마케팅전략', value: 'marketing' },
                { label: '고객관리', value: 'customer' },
              ])}
              {renderCategory('공공서비스', [
                { label: '행정관리', value: 'haengjung' },
                { label: '사회복지', value: 'society' },
                { label: '공공안전', value: 'gonggong' },
              ])}
              {renderCategory('연구개발', [
                { label: '제품개발', value: 'product' },
                { label: '기술연구', value: 'technology' },
                { label: '임상연구', value: 'clinical' },
              ])}
              {renderCategory('정보통신', [
                { label: '네트워크관리', value: 'network' },
                { label: '소프트웨어개발', value: 'software' },
                { label: '정보보안', value: 'security' },
              ])}
              {renderCategory('디자인', [
                { label: '그래픽디자인', value: 'graphicDsgn' },
                { label: 'UX/UI 디자인', value: 'uxuiDsgn' },
                { label: '제품디자인', value: 'productDsgn' },
              ])}
              {renderCategory('생산관리', [
                { label: '생산계획', value: 'saengsan' },
                { label: '품질관리', value: 'qa' },
                { label: '공정관리', value: 'process' },
              ])}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.buttonText}>돌아가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>수정하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleCardPress(quitUrl)}>
              <Text style={styles.buttonText}>회원탈퇴</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  function renderCategory(title, jobs) {
    return (
      <View key={title}>
        <TouchableOpacity onPress={() => toggleCategory(title)}>
          <Text style={styles.categoryToggle}>{title}</Text>
        </TouchableOpacity>
        {expandedCategory === title && (
          <View style={styles.category}>
            {jobs.map((job) => (
              <View key={job.value} style={styles.radio}>
                <CheckBox
                  value={selectedJob === job.value}
                  onValueChange={() => handleJobChange(job.value)}
                  tintColors={{ true: '#668DC0', false: '#ccc' }}
                />
                <Text>{job.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subContainer: {
    padding: 20,
    borderRadius: 10,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    marginTop: 10,
    color: 'gray',
  },
  formContainer: {
    marginTop: 20,
  },
  formItem: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  tree: {
    marginTop: 16,
    marginBottom: 16,
  },
  categoryToggle: {
    fontWeight: 'bold',
  },
  category: {
    marginTop: 10,
    paddingLeft: 20,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#e6e6e6',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings;