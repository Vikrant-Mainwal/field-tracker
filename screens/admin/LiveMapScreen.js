import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";

const LiveMapScreen = () => {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const mapRef = useRef(null);

  const fetchLiveLocations = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await API.get("/location/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLocations(res.data);

    if (!selectedUserId && res.data.length > 0) {
      setSelectedUserId(res.data[0].userId._id);
    }
  };

  useEffect(() => {
    fetchLiveLocations();
    const interval = setInterval(fetchLiveLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredWorkers = locations.filter((l) =>
    l.userId.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedWorker = locations.find((l) => l.userId._id === selectedUserId);

  useEffect(() => {
    if (!mapRef.current || !selectedWorker) return;

    mapRef.current.animateToRegion(
      {
        latitude: selectedWorker.latitude,
        longitude: selectedWorker.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600,
    );
  }, [selectedWorker]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Live Tracking</Text>
          <Text style={styles.subtitle}>
            Monitor all field workers in real-time
          </Text>
        </View>

        <Pressable onPress={fetchLiveLocations}>
          <Ionicons name="refresh-outline" size={22} />
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={16} color="#6B7280" />
        <TextInput
          placeholder="Search workers..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.mapContainer}>
        <MapView ref={mapRef} style={StyleSheet.absoluteFillObject}>
          {filteredWorkers.map((worker) => (
            <Marker
              key={worker.userId._id}
              coordinate={{
                latitude: worker.latitude,
                longitude: worker.longitude,
              }}
              onPress={() => setSelectedUserId(worker.userId._id)}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>
                  {worker.userId.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>

        {selectedWorker && (
          <View style={styles.selectedCard}>
            <Text style={styles.workerName}>{selectedWorker.userId.name}</Text>
            <Text style={styles.workerSub}>Live location • just now</Text>
          </View>
        )}
      </View>

      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Workers List</Text>
          <Text style={styles.listCount}>{filteredWorkers.length} workers</Text>
        </View>

        <FlatList
          data={filteredWorkers}
          keyExtractor={(item) => item.userId._id}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.workerItem,
                selectedUserId === item.userId._id && styles.workerActive,
              ]}
              onPress={() => setSelectedUserId(item.userId._id)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.userId.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.workerItemName}>{item.userId.name}</Text>
                <Text style={styles.workerItemSub}>
                  Accuracy: ±
                  {typeof item.accuracy === "number"
                    ? `${item.accuracy}m`
                    : "N/A"}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};

export default LiveMapScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { fontSize: 13, color: "#6B7280" },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchInput: { flex: 1, marginLeft: 6, height: 40 },

  mapContainer: {
    height: 300,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },

  marker: {
    backgroundColor: "#2563EB",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  markerText: { color: "#FFF", fontWeight: "700", fontSize: 12 },

  selectedCard: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    elevation: 5,
  },

  workerName: { fontWeight: "600" },
  workerSub: { fontSize: 12, color: "#6B7280" },

  listContainer: {
    flex: 1,
    marginTop: 12,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  listTitle: { fontSize: 16, fontWeight: "600" },
  listCount: { fontSize: 12, color: "#6B7280" },

  workerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },

  workerActive: { backgroundColor: "#EFF6FF" },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: { color: "#2563EB", fontWeight: "600" },

  workerItemName: { fontWeight: "500" },
  workerItemSub: { fontSize: 12, color: "#6B7280" },
});
