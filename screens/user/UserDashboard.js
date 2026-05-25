import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { COLORS } from "../../utils/theme";
import Card from "../../components/Card";
import * as Location from 'expo-location';
import API from '../../api/api';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserDashboard() {
  const [checkedIn, setCheckedIn] = useState(false);

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const currentDate = new Date().toDateString();

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied");
      return;
    }

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 30000,
        distanceInterval: 10,
      },
      async (location) => {
        const token = await AsyncStorage.getItem("token");

        await API.post(
          "/location/update",
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Location sent");
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.name}>Rajesh Kumar</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
      </View>

      {/* Check In Card */}
      <View style={styles.mainCard}>
        <Text style={styles.status}>
          {checkedIn ? "Checked In" : "Checked Out"}
        </Text>

        <Text style={styles.time}>{currentTime}</Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: checkedIn ? COLORS.danger : COLORS.success },
          ]}
          onPress={() => {
            setCheckedIn(!checkedIn);
            if (!checkedIn) {
              startTracking();
            }
          }}
        >
          <Text style={styles.btnText}>
            {checkedIn ? "Check Out" : "Check In"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Cards */}
      <Card>
        <Text style={styles.cardTitle}>GPS Location</Text>
        <Text style={styles.sub}>Active & Tracking</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Today’s Work Hours</Text>
        <Text style={styles.sub}>
          {checkedIn ? "4h 32m" : "0h 0m"}
        </Text>
      </Card>

      {/* Weekly Stats */}
      <View style={styles.row}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>₹2450</Text>
          <Text style={styles.statLabel}>Expenses</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>32h</Text>
          <Text style={styles.statLabel}>Hours</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.bg,
  },

  header: {
    marginBottom: 20,
  },

  greeting: {
    color: COLORS.subText,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },

  date: {
    color: COLORS.subText,
    marginTop: 4,
  },

  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },

  status: {
    fontSize: 16,
    color: COLORS.subText,
  },

  time: {
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 10,
  },

  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  sub: {
    color: COLORS.subText,
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
  },

  statLabel: {
    color: COLORS.subText,
    marginTop: 4,
  },
});
