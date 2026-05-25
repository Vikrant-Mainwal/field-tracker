import {
  View,
  Text,
  FlatList,
  Linking,
  Modal,
  Pressable,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";

export default function ExpenseListScreen() {
  const [expenses, setExpenses] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending"); // default pending

  const loadExpenses = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await API.get("/expense/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setExpenses(res.data);
  };

  const updateStatus = async (id, status) => {
    const token = await AsyncStorage.getItem("token");
    await API.put(
      `/expense/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadExpenses();
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch = item.userId?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    if (status === "approved") return "#16a34a";
    if (status === "rejected") return "#dc2626";
    return "#f59e0b";
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search worker..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {["all", "pending", "approved", "rejected"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              statusFilter === status && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter(status)}
          >
            <Text
              style={{
                color: statusFilter === status ? "white" : "#374151",
                textTransform: "capitalize",
              }}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Expense List */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.workerName}>
                {item.userId?.name}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {item.status}
                </Text>
              </View>
            </View>

            <Text style={styles.amount}>₹ {item.amount}</Text>

            <Pressable onPress={() => setPreviewImage(item.billImage)}>
              <Text style={styles.linkText}>View Receipt</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps?q=${item.location.latitude},${item.location.longitude}`
                )
              }
            >
              <Text style={styles.linkText}>View Location</Text>
            </Pressable>

            {item.status === "pending" && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => updateStatus(item._id, "approved")}
                >
                  <Text style={{ color: "white" }}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => updateStatus(item._id, "rejected")}
                >
                  <Text style={{ color: "white" }}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      {/* SINGLE GLOBAL MODAL */}
      <Modal visible={!!previewImage} transparent animationType="fade">
        <View style={styles.modal}>

          <Image
            source={{ uri: previewImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />

          <Pressable
            style={styles.closeButton}
            onPress={() => setPreviewImage(null)}
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 40,
    top:10,
  },
  searchInput: {
    top: 10,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: "#2563eb",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    textTransform: "capitalize",
  },
  linkText: {
    color: "#2563eb",
    marginTop: 6,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  approveBtn: {
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  rejectBtn: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#00000099",
    padding: 14,
    borderRadius: 100,
    zIndex: 999,
    elevation: 10,
  },
  closeText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
