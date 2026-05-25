import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddExpenseScreen from "../screens/user/AddExpenseScreen";
import UserProfileScreen from "../screens/user/UserProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/theme";
import AllExpenseListScreen from "../screens/user/AllExpenseListScreen";
import UserDashboard from "../screens/user/UserDashboard";

const Tab = createBottomTabNavigator();

export default function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Dashboard") iconName = "home";
          else if (route.name === "Add Expense") iconName = "add-circle";
          else if (route.name === "All Expenses") iconName = "list";
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard" component={UserDashboard} />
      <Tab.Screen name="Add Expense" component={AddExpenseScreen} />
      <Tab.Screen name="All Expenses" component={AllExpenseListScreen} />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}
