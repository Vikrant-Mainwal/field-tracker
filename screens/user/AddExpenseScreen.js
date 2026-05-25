import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

const categories = [
  { id: "Travel", icon: "car-outline" },
  { id: "Food", icon: "fast-food-outline" },
  { id: "Material", icon: "cube-outline" },
  { id: "Other", icon: "ellipsis-horizontal-outline" },
];

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Travel");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const currentDate = new Date().toDateString();
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const submitExpense = async () => {
    if (loading) return;
    try {
      if (!amount || !image) {
        return Alert.alert("All fields required");
      }
      setLoading(true);
      // upload image
      const imageUrl = await uploadToCloudinary(image);

      // get location
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const token = await AsyncStorage.getItem("token");

      await API.post(
        "/expense/add",
        {
          amount,
          note,
          billImage: imageUrl,
          latitude,
          longitude,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Alert.alert("Success", "Expense submitted");
      setAmount("");
      setNote("");
      setImage(null);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not submit expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f6fa" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Add Expense</Text>
        <Text style={styles.subtitle}>Submit a new expense claim</Text>
      </View>

      <View style={styles.container}>
        {/* Amount */}
        <Text style={styles.label}>Amount (₹)</Text>
        <View style={styles.amountBox}>
          <Text style={styles.currency}>₹</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            style={styles.amountInput}
          />
        </View>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              style={[
                styles.categoryCard,
                category === cat.id && styles.categoryActive,
              ]}
            >
              <Ionicons
                name={cat.icon}
                size={24}
                color={category === cat.id ? "#2563eb" : "#6b7280"}
              />
              <Text
                style={[
                  styles.categoryText,
                  category === cat.id && { color: "#2563eb" },
                ]}
              >
                {cat.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notes / Description</Text>
        <TextInput
          placeholder="Enter expense details..."
          value={note}
          onChangeText={setNote}
          multiline
          style={styles.textarea}
        />

        {/* Image Upload */}
        <Text style={styles.label}>Bill / Receipt Photo</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {image ? (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              <Text style={{ color: "#16a34a", fontWeight: "600" }}>
                Photo Attached
              </Text>
            </>
          ) : (
            <>
              <Feather name="camera" size={24} color="#6b7280" />
              <Text style={{ color: "#6b7280" }}>Tap to capture or upload</Text>
            </>
          )}
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            style={{ height: 150, borderRadius: 12, marginTop: 10 }}
          />
        )}

        {/* Auto Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>AUTO-ATTACHED INFORMATION</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#2563eb" />
            <Text style={styles.infoText}>Live location attached</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={18} color="#2563eb" />
            <Text style={styles.infoText}>
              {currentDate} at {currentTime}
            </Text>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={submitExpense}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#fff" />
              <Text style={styles.submitText}>Submitting...</Text>
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.submitText}>Submit Expense</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = {
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  container: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 16,
  },
  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },
  currency: {
    fontSize: 22,
    fontWeight: "700",
    marginRight: 6,
  },
  amountInput: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "23%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryActive: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  categoryText: {
    fontSize: 12,
    marginTop: 6,
    color: "#6b7280",
    fontWeight: "600",
  },
  textarea: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    minHeight: 100,
    textAlignVertical: "top",
  },
  uploadBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    padding: 18,
    alignItems: "center",
    gap: 8,
  },
  infoBox: {
    backgroundColor: "#eef2ff",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
};
