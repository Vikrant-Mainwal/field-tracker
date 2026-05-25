import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/api";
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });

      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") {
        navigation.replace("AdminHome");
      } else {
        navigation.replace("UserHome");
      }
    } catch (err) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header / Branding */}
      <LinearGradient
        colors={["#4f46e5", "#6366f1"]}
        style={styles.header}
      >
        <Feather name="map" size={34} color="#fff" />
        <Text style={styles.logoText}>GeoExpense</Text>
        <Text style={styles.subtitle}>
          Track expenses wherever you go
        </Text>
      </LinearGradient>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.desc}>Sign in to continue</Text>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={20} color="#666" />
          <TextInput
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#666" />
          <TextInput
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Signup */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signupText}>
            Don’t have an account?{" "}
            <Text style={{ color: "#4f46e5", fontWeight: "600" }}>
              Create one
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },

  header: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  logoText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 8,
  },

  subtitle: {
    color: "#e0e7ff",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -60,
    borderRadius: 20,
    padding: 20,
    elevation: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },

  desc: {
    color: "#666",
    marginBottom: 20,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
    height: 48,
  },

  input: {
    flex: 1,
    marginLeft: 10,
  },

  loginBtn: {
    backgroundColor: "#4f46e5",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  signupText: {
    textAlign: "center",
    marginTop: 16,
    color: "#666",
  },
});
