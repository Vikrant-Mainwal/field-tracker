import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";
import ExpenseCard from "../../components/ExpenseCard";
import { useNavigation } from "@react-navigation/native";

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await API.get("/expense/mybills", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setExpenses(res.data);
  };

  const totalAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const pendingCount = expenses.filter(
    (exp) => exp.status === "Pending"
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Expenses</Text>
          <Text style={styles.subtitle}>Your expense history</Text>
        </View>

        {/* <Pressable style={styles.filterBtn}>
          <Ionicons name="filter-outline" size={18} />
        </Pressable> */}
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            <View style={styles.summaryRow}>
              <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total This Month</Text>
                <Text style={styles.totalValue}>
                  ₹{totalAmount.toLocaleString()}
                </Text>
              </View>

              <View style={styles.pendingCard}>
                <Text style={styles.pendingLabel}>Pending Approval</Text>
                <Text style={styles.pendingValue}>
                  {pendingCount} Claims
                </Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Expenses</Text>
              <Text style={styles.sectionCount}>
                {expenses.length} items
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => {
          const dateObj = new Date(item.createdAt);

          return (
            <ExpenseCard
              amount={item.amount}
              category={item.category || "Other"}
              notes={item.notes || "No notes"}
              location={item.location || "Unknown"}
              date={dateObj.toDateString()}
              time={dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              status={item.status}
            />
          );
        }}
      />

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate("Add Expense")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  totalCard: {
    flex: 1,
    backgroundColor: "#2563EB",
    borderRadius: 16,
    padding: 16,
  },

  totalLabel: {
    fontSize: 12,
    color: "#DBEAFE",
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 6,
  },

  pendingCard: {
    flex: 1,
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },

  pendingLabel: {
    fontSize: 12,
    color: "#D97706",
  },

  pendingValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#92400E",
    marginTop: 6,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  sectionCount: {
    fontSize: 12,
    color: "#6B7280",
  },

  fab: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
});
