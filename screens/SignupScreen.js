import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from "expo-linear-gradient";
import API from "../api/api";


function RoleCard({ title, desc, icon, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.roleCard,
        selected && styles.roleCardActive,
      ]}
      onPress={onPress}
    >
      <Feather
        name={icon}
        size={28}
        color={selected ? "#4f46e5" : "#666"}
      />
      <Text
        style={[
          styles.roleTitleText,
          selected && { color: "#4f46e5" },
        ]}
      >
        {title}
      </Text>
      <Text style={styles.roleDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}


export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });

      alert("Account created successfully");
      navigation.replace("Login");
    } catch (err) {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#4f46e5", "#6366f1"]}
        style={styles.header}
      >
        <Feather name="user-plus" size={34} color="#fff" />
        <Text style={styles.logoText}>Create Account</Text>
        <Text style={styles.subtitle}>Join GeoExpense today</Text>
      </LinearGradient>

      {/* Card */}
      <View style={styles.card}>
        {/* Name */}
        <View style={styles.inputWrapper}>
          <Feather name="user" size={20} color="#666" />
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

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

        {/* Role Selector */}
        <Text style={styles.roleTitle}>Account Type</Text>
        <View style={styles.roleContainer}>
          <RoleCard
            title="Admin"
            desc="Manage team expenses"
            icon="shield"
            selected={role === "admin"}
            onPress={() => setRole("admin")}
          />
          <RoleCard
            title="User"
            desc="Track personal expenses"
            icon="user"
            selected={role === "user"}
            onPress={() => setRole("user")}
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#666" />
          <TextInput
            placeholder="Password"
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

        {/* Confirm Password */}
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#666" />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            <Feather
              name={
                showConfirmPassword
                  ? "eye-off"
                  : "eye"
              }
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signupText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login link */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginLink}>
            Already have an account?{" "}
            <Text style={{ color: "#4f46e5", fontWeight: "600" }}>
              Sign In
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

  roleTitle: {
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 6,
  },

  roleContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  roleCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },

  roleCardActive: {
    borderColor: "#4f46e5",
    backgroundColor: "#eef2ff",
  },

  roleTitleText: {
    fontWeight: "600",
    marginTop: 6,
  },

  roleDesc: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },

  signupBtn: {
    backgroundColor: "#4f46e5",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  signupText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  loginLink: {
    textAlign: "center",
    marginTop: 16,
    color: "#666",
  },
});
