import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

const banners = [
  { id: '1', image: require('../assets/images/banner-1.png') },
  { id: '2', image: require('../assets/images/banner-2.png') },
  { id: '3', image: require('../assets/images/banner-3.png') },
  { id: '4', image: require('../assets/images/banner-4.png') },
  { id: '5', image: require('../assets/images/banner-5.png') },
];

const Ad = () => {
  const flatListRef = useRef(null);
  let scrollValue = 0;
  let scrolled = 0;

  useEffect(() => {
    const intervalId = setInterval(() => {
      scrolled++;
      if (scrolled < banners.length) {
        scrollValue = scrollValue + width;
      } else {
        scrollValue = 0;
        scrolled = 0;
      }
      flatListRef.current.scrollToOffset({ animated: true, offset: scrollValue });
    }, 3000); // 3초마다 스크롤

    return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 인터벌 클리어
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        renderItem={({ item }) => (
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
            </View>
        )}
      />
    </View>
  );
};

const styles = {
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        width: width,
        // justifyContent: 'center',
        // alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: '90%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
    },
};
export default Ad;