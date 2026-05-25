import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LiveMapScreen from "../screens/admin/LiveMapScreen";
import ExpenseListScreen from "../screens/admin/ExpenseListScreen";
import AdminProfileScreen from "../screens/admin/AdminProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/theme";
import AdminDashboard from "../screens/admin/AdminDashboard";

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") iconName = "home";
          else if (route.name === "Live Map") iconName = "map";
          else if (route.name === "Expenses") iconName = "receipt";
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "gray",
      })}>
        <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Live Map" component={LiveMapScreen} />
      <Tab.Screen name="Expenses" component={ExpenseListScreen} />
      <Tab.Screen name="Profile" component={AdminProfileScreen} />
    </Tab.Navigator>
  );
}
