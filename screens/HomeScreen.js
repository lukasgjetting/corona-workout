import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { ImageBackground, Image, Platform, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import workout from '../assets/images/workout.jpg';
import shape from '../assets/images/shape.png';

const dimensions = Dimensions.get('window');
const itemSize = dimensions.width * 0.12;

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={workout}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.present}>
          Emse and Luki present
        </Text>
        <Text style={styles.title}>
          Corona Workout Challenge
        </Text>
        <View style={styles.itemsContainer}>
          {[...new Array(5)].map((x, row) => (
            <View key={row} style={styles.row}>
              {[...new Array(6)].map((y, column) => {
                const number = (row * 6) + (column + 1);
                let tint;

                const next = 25;

                if (number < next) {
                  tint = 'green';
                }

                if (number === next) {
                  tint = 'orange';
                }

                return (
                  <View key={column} style={styles.item}>
                    <ImageBackground
                      source={shape}
                      style={styles.innerItem}
                      tintColor={tint}
                    >
                      <Text style={styles.itemText}>{number}</Text>
                    </ImageBackground>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Workout')}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: '#1F232ECC',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    padding: 16,
    paddingTop: 40,
  },
  present: {
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
    paddingTop: 8,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
  },
  itemsContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
  },
  innerItem: {
    borderRadius: itemSize / 2,
    height: itemSize,
    width: itemSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: '#FFFD',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
  },
  button: {
    backgroundColor: '#3A44B2',
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
