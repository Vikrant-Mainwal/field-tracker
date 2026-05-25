import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { use, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";

const UserProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false); 

  const navigation = useNavigation();

  const getUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await API.get("auth/me",{
        headers: {Authorization: `Bearer ${token}`}
      })
      const user = res.data;
      setUser(user);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(()=>{
    getUserInfo();
  },[]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await AsyncStorage.clear();
    navigation.replace("Login");
    setLoggingOut(false);
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.slice(0, 1).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user?.name || "user name"}</Text>
        <Text style={styles.role}>{user?.role || "Position"}</Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <InfoRow icon="mail-outline" label="Email" value={user?.email || "No email"} />
        <InfoRow icon="call-outline" label="Phone" value={user?.phone || "No phone"} />
        <InfoRow
          icon="location-outline"
          label="Work Area"
          value={user?.workArea || "Not specified"}
        />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        {loggingOut ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Sign Out</Text>
                  </>
                )}
      </TouchableOpacity>

      <Text style={styles.version}>FieldTrack</Text>
    </View>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <Ionicons name={icon} size={20} color="#666" />
    <View style={{ marginLeft: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

export default UserProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    padding: 20,
    marginTop: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
  },

  role: {
    color: "#666",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  label: {
    fontSize: 12,
    color: "#888",
  },

  value: {
    fontSize: 14,
    fontWeight: "500",
  },

  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#EF4444",
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },

  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 20,
  },
});
