import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ad from './Ad';
import { BASE_URL } from '@env';

const { width } = Dimensions.get('window'); 

const Recruitment = () => {
  const navigation = useNavigation();
  const [jobPostings1, setJobPostings1] = useState([]);
  const [jobPostings2, setJobPostings2] = useState([]);

  // 서버에서 채용공고 데이터 가져오기
  const fetchJobPostings = async () => {

    try {
      const response = await fetch(`${BASE_URL}/job/card`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
  
      if (response.ok) {
        // 서버에서 받은 데이터를 상태에 저장
        const allJobPostings = [
          ...result.datago,
          ...result.saramin
        ];
        setJobPostings1(allJobPostings.slice(0, 5));
        setJobPostings2(allJobPostings.slice(5, 10));
    } else {
        alert(result.message || '채용공고를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('채용서버와 통신 중 오류가 발생했습니다:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchJobPostings(); // 컴포넌트가 마운트될 때 데이터 가져오기
  }, []);

  // 카드 클릭시 웹뷰로 이동
  const handleCardPress = (url) => {
    console.log('url로 이동:', url);
    navigation.navigate('JobWebView', { url });
  };

  const renderItem1 = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item.URL)}>
      <View style={styles.jobItem}>
        <Text style={styles.jobTitle} numberOfLines={3} ellipsizeMode="tail">{item.title || item.직책_제목}</Text>
        <View style={styles.spacer} />
        <Text style={styles.jobCompany} numberOfLines={2} ellipsizeMode="tail">{item.company || item.회사_세부사항_이름}</Text>
        <Text style={styles.jobLocation} numberOfLines={1} ellipsizeMode="tail">{item.description || item.직책_위치_이름}</Text>
        <Text style={styles.deadline}>{item.deadline || item.열림타임스탬프} ~ {item.expireTimestamp || item.만료타임스탬프}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItem2 = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item.URL)}>
      <View style={styles.cards}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{item.title || item.직책_제목}</Text>
        <View style={styles.spacer} />
        <Text style={styles.company}>{item.compan || item.회사_세부사항_이름y}</Text>
        <Text>{item.description || item.직책_위치_이름}</Text>
        <Text>{item.직책_경력수준_이름}</Text>
        <Text style={styles.deadline}>{item.deadline || item.열림타임스탬프} ~ {item.expireTimestamp || item.만료타임스탬프}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
        <View>
          <Text style={styles.boldText}>최신 채용정보를 확인하세요</Text>
            <FlatList
              data={jobPostings1}
              renderItem={renderItem1}
              keyExtractor={(item) => item.id || item._id}
              horizontal
              contentContainerStyle={styles.contentContainer}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="start"
              decelerationRate="fast"
            />
        </View>
        <View>
            <Ad />
        </View>
        <View>
            <FlatList
                data={jobPostings2}
                renderItem={renderItem2}
                keyExtractor={(item) => item.id || item._id}
                contentContainerStyle={styles.jobContainer}
            />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 0,
  },
  card: {
    width: width * 0.6,
    height: 150,
    marginRight: 20,
    padding: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 18,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    marginTop: 5,
  },
  deadline: {
    fontSize: 14,
    marginTop: 5,
    color: 'gray',
  },
  boldText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  adContainer: {
    marginBottom: 20,
  },
  jobContainer: {
    width: '100%',
    flexDirection: 'column',
  },
  cards: {
    height: 200,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#efefef',
    padding: 15,
    marginBottom: 10,
    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  jobItem: {
    width: width * 0.6,
    height: 200,
    marginRight: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  jobCompany: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  jobLocation: {
    fontSize: 14,
    color: '#999',
  },
  spacer: {
    flexGrow: 1,
  },
});

export default Recruitment;