import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from '@env';

const Logs = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('interview');
    const [expandedItem, setExpandedItem] = useState(null);
    const [interviewLogs, setInterviewLogs] = useState([]);
    const [memoLogs, setMemoLogs] = useState([]);

    const [editingMemo, setEditingMemo] = useState(null); // 현재 수정 중인 메모 ID
    const [editedContent, setEditedContent] = useState(''); // 수정된 메모 내용

    const route = useRoute();
    const { email } = route.params;

    // 면접기록 가져오기
    const fetchInterviewLogs = async () => {
      try {
          const response = await fetch(`${BASE_URL}/chatbot/summaryList/${email}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          if (response.ok) {
            const result = await response.json();
            setInterviewLogs(result.slice(0, 10)); // 최근 10개
          } else {
              Alert(result.message || '면접 기록을 가져오는 데 실패했습니다.');
          }
      } catch (error) {
          Alert('서버와 통신 중 오류가 발생했습니다.');
      }
    };

    // 메모기록 가져오기
    const fetchMemoLogs = async () => {
      try {
          const response = await fetch('http://localhost:8080/memo/recent', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          const result = await response.json();

          if (response.ok) {
              setMemoLogs(result.slice(0, 10)); // 최근 10개
          } else {
              Alert(result.message || '메모를 가져오는 데 실패했습니다.');
          }
      } catch (error) {
          Alert('서버와 통신 중 오류가 발생했습니다.');
      }
    };

    useEffect(() => {
      fetchInterviewLogs();
    }, [email]);

    useFocusEffect(
      React.useCallback(() => {
          fetchInterviewLogs();
      }, [email])
    );

    const memoData = [
        { id: '1', content: '삼성전자 면접 메모' },
        { id: '2', content: 'LG전자 면접 메모' },
        { id: '3', content: 'SK하이닉스 면접 메모' },
        { id: '4', content: '농심 면접 메모' },
    ]; // 나중에 삭제할 것

    const renderItem1 = ({ item }) => (
      <TouchableOpacity
        style={styles.item}
        onPress={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
      >
        <View style={styles.itemHeader}>
            <Text>{item.company}</Text>
            <TouchableOpacity   TouchableOpacity onPress={() => deleteItem(item._id, 'interview')}>
                <Text style={styles.deleteText}>-</Text>
            </TouchableOpacity>
        </View>
        {expandedItem === item.id && (
          <View style={styles.expandedView}>
            <Text>{item.evaluation}</Text>
          </View>
        )}
      </TouchableOpacity>
    );

    const renderItem2 = ({ item }) => (
      <TouchableOpacity
        style={styles.item}
        onPress={() => setExpandedItem(expandedItem === item._id ? null : item._id)}
      >
        <View style={styles.itemHeader}>
        <Text>{item.content}</Text>
            <View style={styles.memoActions}>
                <TouchableOpacity onPress={() => {/* 수정 기능 */}}>
                    <Text style={styles.editText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(item._id, 'memo')}>
                    <Text style={styles.deleteText}>-</Text>
                </TouchableOpacity>
            </View>
        </View>
        {expandedItem === item._id && (
          <View style={styles.expandedView}>
            <Text>{item.evaluation}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  
    // 면접기록 렌더링
    const renderInterviewItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => setExpandedItem(expandedItem === item._id ? null : item._id)}
        >
            <View style={styles.itemHeader}>
            <Text style={styles.boardTitle}>면접 제목: {item.title}</Text>
                {/* <TouchableOpacity onPress={() => deleteItem(item._id, 'interview')}>
                    <Text style={styles.deleteText}>-</Text>
                </TouchableOpacity> */}
            </View>
            {expandedItem === item._id && (
                <View style={styles.expandedView}>
                    <Text style={styles.itemTitle}>총점: {item.score}</Text>
                    <Text style={styles.itemSubTitle}>강점: {item.strengths}</Text>
                    <Text style={styles.itemSubTitle}>약점: {item.weaknesses}</Text>
                    <Text style={styles.itemSubTitle}>화법: {item.delivery}</Text>
                    <Text style={styles.itemSubTitle}>총평가: {item.total}</Text>
                    <Text style={styles.itemSubTitle}>면접일자: {item.createdAt}</Text>
              </View>
            )}
      </TouchableOpacity>
    );

    // 메모장 렌더링
    const renderMemoItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
      >
            <View style={styles.itemHeader}>
                <Text>{item.title}</Text>
                <View style={styles.memoActions}>
                        <TouchableOpacity onPress={() => startEditingMemo(item)}>
                            <Text style={styles.editText}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteItem(item._id, 'memo')}>
                            <Text style={styles.deleteText}>-</Text>
                        </TouchableOpacity>
                </View>
            </View>
            {expandedItem === item.id && (
              <View style={styles.expandedView}>
                <>
                    <TextInput
                        style={styles.input}
                        value={editedContent}
                        onChangeText={setEditedContent}
                    />
                    <TouchableOpacity onPress={() => saveEditedMemo(item._id)}>
                        <Text style={styles.saveText}>저장</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text>{item.content}</Text>
                    <Text>작성시간: {item.timestamp}</Text>
                </>
              </View>
            )}
      </TouchableOpacity>
    );

    // 메모 수정
    const startEditingMemo = (memo) => {
        setEditingMemo(memo._id);
        setEditedContent(memo.content);
    };

    const saveEditedMemo = async (id) => {
        try {
            const response = await fetch(`http://api/memo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: editedContent })
            });
    
            if (response.ok) {
                setMemoLogs(memoLogs.map(memo => memo._id === id ? { ...memo, content: editedContent } : memo));
                setEditingMemo(null);
                setEditedContent('');
                Alert.alert('메모가 수정되었습니다.');
            } else {
                const result = await response.json();
                Alert.alert(result.message || '메모 수정에 실패했습니다.');
            }
        } catch (error) {
            Alert.alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    // 기록삭제. type: interview or memo
    const deleteItem = (id, type) => {
      return Alert.alert (
        "내용 삭제",
        "삭제하시겠습니까?",
        [
          { text: "삭제", onPress: async () => {
            try {
              const response = await fetch(`http://api/${type}/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                }
              });

              const result = await response.json();

              if (response.ok) {
                if (type === 'interview') {
                  setInterviewLogs(interviewLogs.filter(item => item._id !== id)); // _id로 비교
                } else if (type === 'memo') {
                  setMemoLogs(memoLogs.filter(item => item._id !== id));
                }
                fetchMemoLogs();
              } else {
                Alert(result.message || '기록을 삭제하는 데 실패했습니다.');
              }
            } catch (error) {
              Alert('서버와 통신 중 오류가 발생했습니다.');
            }
          }},
          { text: "취소" },
        ]
      );
    };

    // 탭 전환 시 expandedItem 초기화
    const handleTabPress = (tab) => {
        setSelectedTab(tab);
        setExpandedItem(null);
    };

  return (
      <View style={styles.container}>
          <View style={styles.subContainer}>
            <View style={styles.menuBar}>
              <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.navigate('Dashboard')}>
                <Image source={require('../assets/images/icons/menu-back.png')} style={styles.menuIcon} />
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.menuBar2}>
                <TouchableOpacity onPress={() => navigation.navigate('MemoWrite')}>
                  <Image source={require('../assets/images/icons/menu-add.png')} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteItem}>
                  <Image source={require('../assets/images/icons/menu-remove.png')} style={styles.menuIcon} />
                </TouchableOpacity>
              </TouchableOpacity> */}
            </View>
            <View style={styles.header}>
              <Text style={styles.title}>나의 면접기록</Text>
              <Text style={styles.subTitle}>면접 기록을 살펴보고 계획을 세워보세요.</Text>
              {/* <View style={styles.tabBar}>
                  <TouchableOpacity
                      style={[
                          styles.tabItem,
                          selectedTab === 'interview' && styles.selectedTabItem, 
                      ]}
                      onPress={() => handleTabPress('interview')}
                  >
                  <Text style={selectedTab === 'interview' ? styles.selectedTabText : styles.tabText}>
                      면접기록
                  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[
                          styles.tabItem,
                          selectedTab === 'memo' && styles.selectedTabItem,
                      ]}
                      onPress={() => handleTabPress('memo')}
                  >
                  <Text style={selectedTab === 'memo' ? styles.selectedTabText : styles.tabText}>
                      메모장
                  </Text>
                  </TouchableOpacity>
              </View> */}

              {selectedTab === 'interview' ? (
                  <FlatList
                      // data={interviewData}
                      // renderItem={renderItem1}
                      data={interviewLogs}
                      renderItem={renderInterviewItem}
                      keyExtractor={(item) => item._id}
                  />
              ) : (
                  <FlatList
                      data={memoData}
                      renderItem={renderItem2}
                      // data={memoLogs}
                      // renderItem={renderMemoItem}
                      keyExtractor={(item) => item._id}
                  />
              )}
              </View>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuBar2: {
    flexDirection: 'row',
    gap: 5,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  menuIcon: {
    width: 30,
    height: 30,
    opacity: 0.5,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabItem: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTabItem: {
    borderBottomColor: 'black',
  },
  tabText: {
    color: 'gray',
  },
  selectedTabText: {
    color: 'black',
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  expandedView: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  memoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    deleteText: {
        color: 'red',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    editText: {
        color: 'green',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    memoActions: {
        flexDirection: 'row',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
    },
    saveText: {
        color: 'blue',
        marginTop: 10,
    },
    boardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    itemSubTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
});

export default Logs;