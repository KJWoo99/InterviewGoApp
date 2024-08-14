import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import commonStyles from '../styles/commonStyles';


const SetInterview = () => {
  const navigation = useNavigation();    
  const [selectedJob, setSelectedJob] = useState('');
  const [interviewTitle, setJobDetail] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleJobChange = (job) => {
    setSelectedJob(job);
  };

  // 선택한 옵션을 서버로 전송
  const handleStartInterview = async () => {
  
    const data = {
      selectedJob,
      interviewTitle
    };

    // 직무필수. 세부직무는 선택사항
    if (!data.selectedJob) {
      Alert.alert('직무를 선택해 주세요.');
      return;
    }

    if (!data.interviewTitle) {
      Alert.alert('제목을 작성해주세요.');
      return;
    }

    // 면접 시작
    Alert.alert('면접을 시작하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '시작',
        onPress: () => navigation.navigate('Interview', { selectedJob, interviewTitle }),
      },
    ]);
  
    // navigation.navigate('Interview', { selectedJob, interviewTitle });
  };

  return (
    <KeyboardAwareScrollView>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>옵션을 선택해 주세요</Text>
      <Text style={styles.notice}>질문은 총 4회 진행되며, 답변에 따라 추가질문이 있을 수 있습니다.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. 직무 선택</Text>
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. 제목 입력</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="ex) 2024.7.21 인사관리 모의면접"
          placeholderTextColor={'#b3b3b3'}
          value={interviewTitle}
          onChangeText={setJobDetail}
        />
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.button} onPress={handleStartInterview}>
          <Text style={styles.buttonText}>면접 시작하기</Text> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('Dashboard')}}>
          <Text style={styles.buttonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAwareScrollView>
  );

  function renderCategory(title, jobs) {
    return (
      <View>
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
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notice: {
    marginBottom: 16,
    color: '#666',
  },
  section: {
    marginBottom: 10,
    marginTop: 10,
    borderTopWidth: 1,
    
    borderTopColor: '#ccc',
    borderStyle: 'dashed',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  tree: {
    marginTop: 10,
  },
  categoryToggle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
  },
  category: {
    marginLeft: 16,
    marginBottom: 8,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#e6e6e6',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SetInterview;