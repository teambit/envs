const CardComponent = `
import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

type CardProps = {
  title: string;
  paragraph: string;
};

export const Card = ({title, paragraph}: CardProps) => {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.paragraph}>{paragraph}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 42,
    fontWeight: '600',
    color: '#000000',
  },
  paragraph: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
});

`;

export { CardComponent };
