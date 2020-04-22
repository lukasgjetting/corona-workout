import * as WebBrowser from 'expo-web-browser';
import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import { AsyncStorage, ImageBackground, Image, Platform, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import workout from '../assets/images/workout-man.jpg';
import exercises from '../assets/json/exercises.json';

const dimensions = Dimensions.get('window');
const itemSize = dimensions.width * 0.12;

const rounds = 3;
const pauseTime = 30;


const WorkoutScreen = ({ navigation }) => {
  const d = new Date();

  const [startTime, setStartTime] = useState(null);
  const [routine, setRoutine] = useState([]);
  const [exerciseNumber, setExerciseNumber] = useState(0);
  const [pausing, setPausing] = useState(false);
  const [time, setTime] = useState(0);
  const seed = useRef(d.getFullYear() + d.getMonth() + d.getDate());

  const exercise = routine[exerciseNumber];

  const getRandom = () => {
    const result = Math.sin(seed.current++) * 10000;

    return result - Math.floor(result);
  };

  const proceed = () => {
    // If we're at the last exercise, don't bother pausing before proceeding
    if (exerciseNumber === routine.length - 1) {
      setExerciseNumber(exerciseNumber + 1);
      return;
    }

    if (pausing) {
      setExerciseNumber(exerciseNumber + 1);
    } else {
      setTime(pauseTime);
    }

    setPausing(!pausing);
  };

  const save = async () => {
    try {
      const workouts = JSON.parse(await AsyncStorage.getItem('workouts')) || [];

      workouts.push({
        startTime,
        endTime: Date.now(),
        routine,
      });

      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));

      navigation.goBack();
    } catch (e) {
      alert('Could not save \n' + e.message);

      console.error(e);
    }
  };

  useEffect(() => {
    setStartTime(Date.now());

    const generatedRoutine = [...new Array(rounds)].reduce((arr) => [
      ...arr,
      ...Object.values(exercises).map((options) => options[Math.floor(getRandom() * options.length)]),
    ], []);

    setRoutine(generatedRoutine);
  }, []);

  useEffect(() => {
    let timeout;

    if (time > 0) {
      const d = new Date();
      timeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }

    if (time === 0 && pausing) {
      proceed();
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [time]);

  return (
    <View style={styles.container}>
      <Image
        source={workout}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Workout</Text>
        <View style={styles.content}>
          {pausing ? (
            <>
              <Text style={styles.exercise}>Pausing</Text>
              <Text style={styles.reps}>{time}</Text>
              {routine[exerciseNumber + 1] != null && (
                <Text style={styles.upNext}>Up next: {routine[exerciseNumber + 1].name}</Text>
              )}
            </>
          ) : exercise == null ? (
            <>
              <Text style={styles.exercise}>Nice workout!</Text>
              <TouchableOpacity onPress={save} style={styles.button}>
                <Text style={styles.buttonText}>Save workout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.exercise}>{exercise.name}</Text>
              <Text style={styles.reps}>
                {exercise.reps} reps
              </Text>
              <TouchableOpacity onPress={proceed} style={styles.button}>
                <Text style={styles.buttonText}>Proceed</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

WorkoutScreen.navigationOptions = {
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
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exercise: {
    color: 'white',
    fontSize: 54,
    marginBottom: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  reps: {
    color: 'white',
    fontSize: 38,
  },
  upNext: {
    color: 'white',
    marginTop: 16,
    fontSize: 24,
  },
  button: {
    backgroundColor: '#3A44B2',
    padding: 20,
    borderRadius: 5,
    marginTop: 48,
    alignSelf: 'stretch',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WorkoutScreen;
