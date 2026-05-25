import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";

export default function AdminDashboard() {
  const navigation = useNavigation();

  const [activeWorkers, setActiveWorkers] = useState(0);
  const [pendingExpenses, setPendingExpenses] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await API.get("/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setActiveWorkers(res.data.activeWorkers);
    setPendingExpenses(res.data.pendingExpenses);
  };

  return (
    <View style={styles.container}>

      {/* Welcome */}
      <Text style={styles.welcome}>Welcome,</Text>
      <Text style={styles.subtitle}>Here’s what’s happening today</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activeWorkers}</Text>
          <Text style={styles.statLabel}>Active Workers</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingExpenses}</Text>
          <Text style={styles.statLabel}>Pending Expenses</Text>
        </View>
      </View>

      {/* Navigation Cards */}
      <TouchableOpacity
        style={styles.navCard}
        onPress={() => navigation.navigate("Live Map")}
      >
        <Text style={styles.navTitle}>Live Workers</Text>
        <Text style={styles.navSub}>Track workers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navCard}
        onPress={() => navigation.navigate("Expenses")}
      >
        <Text style={styles.navTitle}>Expense Bills</Text>
        <Text style={styles.navSub}>Review and approve expenses</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fafb",
    paddingTop: 40,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    width: "48%",
    elevation: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2563eb",
  },
  statLabel: {
    color: "#6b7280",
    marginTop: 4,
  },
  navCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  navSub: {
    color: "#6b7280",
    marginTop: 4,
  },
});
