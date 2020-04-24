import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Alert,
  Modal,
  AsyncStorage,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import workout from '../../assets/images/workout-woman.jpg';
import shape from '../../assets/images/shape.png';

const dimensions = Dimensions.get('window');
const itemSize = dimensions.width * 0.15;

const formatDate = (timestamp) => {
  const m = moment(timestamp);

  return m.format('DD. MMMM, HH:mm');
};

const formatDuration = (start, end) => {
  const seconds = (end - start) / 1000;
  const minutes = Math.floor(seconds / 60);

  return `${minutes}:${Math.round(seconds - (minutes * 60))}`;
};

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [workouts, setWorkouts] = useState([]);
  const [openWorkout, setOpenWorkout] = useState(null);

  useEffect(() => {
    const updateWorkouts = async () => {
      const workoutsItem = JSON.parse(await AsyncStorage.getItem('workouts')) || [];
      setWorkouts(workoutsItem);
    };

    updateWorkouts();
  }, [isFocused]);

  const reset = useCallback(() => {
    Alert.alert(
      'Really delete?',
      'Are you sure you want to delete data?',
      [
        { text: 'Nah' },
        {
          text: 'Yes, please',
          onPress: async () => {
            AsyncStorage.removeItem('workouts');
            setWorkouts([]);
          },
        },
      ],
    );
  }, []);

  const openModal = useCallback(
    (workoutNumber) => setOpenWorkout(workouts[workoutNumber - 1]),
    [workouts],
  );

  const closeModal = useCallback(() => setOpenWorkout(null), []);

  return (
    <View style={styles.container}>
      <Image
        source={workout}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <TouchableOpacity
          onLongPress={reset}
          delayLongPress={2500}
        >
          <Text style={styles.present}>
            Emse and Luki present
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          Corona Workout Challenge
        </Text>
        <View style={styles.itemsContainer}>
          {[...new Array(5)].map((x, row) => (
            <View key={row} style={styles.row}>
              {[...new Array(6)].map((y, column) => {
                const number = (row * 6) + (column + 1);
                let tint;
                let Container = View;

                const next = workouts.length + 1;

                if (number < next) {
                  tint = 'green';
                  Container = TouchableOpacity;
                }

                if (number === next) {
                  tint = 'orange';
                }

                return (
                  <Container
                    key={column}
                    style={styles.item}
                    onPress={Container === TouchableOpacity ? () => openModal(number) : undefined}
                  >
                    <ImageBackground
                      source={shape}
                      style={styles.innerItem}
                      tintColor={tint}
                      resizeMode="contain"
                    >
                      <Text style={styles.itemText}>{number}</Text>
                    </ImageBackground>
                  </Container>
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
      <Modal
        visible={openWorkout != null}
        onDismiss={closeModal}
        onRequestClose={closeModal}
        style={styles.modal}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        {openWorkout != null && (
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalContent}>
              <View style={styles.modalInner}>
                <Text style={styles.modalTitle}>
                  {`Day ${workouts.indexOf(openWorkout) + 1}`}
                </Text>
                <View style={[styles.modalBox, styles.timeWrapper]}>
                  <Text style={styles.workoutTime}>
                    <AntDesign
                      name="calendar"
                      color="white"
                      size={18}
                      iconStyle={styles.modalIcon}
                    />
                    {` ${formatDate(openWorkout.startTime)}`}
                  </Text>
                  <Text style={styles.workoutTime}>
                    <AntDesign
                      name="clockcircleo"
                      color="white"
                      size={16}
                      iconStyle={styles.modalIcon}
                    />
                    {` ${formatDuration(openWorkout.startTime, openWorkout.endTime)}`}
                  </Text>
                </View>
                <Text style={styles.routineTitle}>Routine</Text>
                <View style={styles.routineOuter}>
                  <View style={styles.routineNumbers}>
                    {openWorkout.routine.map((exercise, index) => (
                      <View style={styles.exerciseNumberWrapper}>
                        <Text style={styles.exerciseNumber}>{index + 1}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.modalBox, styles.routineWrapper]}>
                    {openWorkout.routine.map((exercise, index) => (
                      <View key={index} style={styles.exerciseWrapper}>
                        <Text style={styles.exercise}>
                          {exercise.name}
                        </Text>
                        <Text style={styles.exerciseReps}>
                          {`${exercise.reps} reps`}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Modal>
    </View>
  );
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
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0008',
  },
  modalInner: {
    backgroundColor: '#1F232E',
    padding: 24,
    paddingTop: 16,
    borderRadius: 8,
    minWidth: dimensions.width * 0.75,
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  timeWrapper: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  modalBox: {
    backgroundColor: '#383C47',
    padding: 12,
    borderRadius: 8,
  },
  workoutTime: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 4,
  },
  routineTitle: {
    marginTop: 20,
    marginBottom: 8,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  routineOuter: {
    flexDirection: 'row',
  },
  routineNumbers: {
    marginRight: 4,
    padding: 0,
    alignSelf: 'center',
  },
  exerciseNumber: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
    marginRight: 4,
  },
  routineWrapper: {
    flex: 1,
  },
  exerciseWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exercise: {
    color: 'white',
    marginBottom: 4,
  },
  exerciseReps: {
    color: 'white',
  },
});

export default HomeScreen;
