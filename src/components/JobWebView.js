import React from 'react';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

const JobWebView = () => {

  const route = useRoute();
  const { url } = route.params;

  console.log(url)

  return <WebView source={{ uri: url }} />;
};

export default JobWebView;