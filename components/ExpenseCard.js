import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const categoryIcons = {
  Travel: "car-outline",
  Food: "fast-food-outline",
  Material: "cube-outline",
  Other: "ellipsis-horizontal",
};

const categoryStyles = {
  Travel: { bg: "#DBEAFE", color: "#2563EB" },
  Food: { bg: "#FFEDD5", color: "#EA580C" },
  Material: { bg: "#F3E8FF", color: "#7C3AED" },
  Other: { bg: "#F3F4F6", color: "#4B5563" },
};

const statusStyles = {
  Pending: { bg: "#FEF3C7", color: "#D97706" },
  Approved: { bg: "#DCFCE7", color: "#15803D" },
  Rejected: { bg: "#FEE2E2", color: "#DC2626" },
};

const normalize = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "Other";

const ExpenseCard = ({
  amount,
  category,
  notes,
  location,
  date,
  time,
  status,
}) => {
  const normalizedCategory = normalize(category);
  const safeCategory =
    categoryStyles[normalizedCategory] || categoryStyles.Other;
  const iconName =
    categoryIcons[normalizedCategory] || categoryIcons.Other;

  const safeStatus = statusStyles[status] || statusStyles.Pending;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Category Icon */}
        <View
          style={[
            styles.iconBox,
            { backgroundColor: safeCategory.bg },
          ]}
        >
          <Ionicons
            name={iconName}
            size={20}
            color={safeCategory.color}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.amount}>
              ₹{Number(amount).toLocaleString()}
            </Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: safeStatus.bg },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: safeStatus.color },
                ]}
              >
                {status || "Pending"}
              </Text>
            </View>
          </View>

          <Text style={styles.notes}>{notes}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialIcons
                name="location-pin"
                size={14}
                color="#6B7280"
              />
              {/* <Text style={styles.metaText}>{location}</Text> */}
            </View>

            <View style={styles.metaItem}>
              <Ionicons
                name="time-outline"
                size={14}
                color="#6B7280"
              />
              <Text style={styles.metaText}>
                {date} • {time}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ExpenseCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  notes: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
  },
});
