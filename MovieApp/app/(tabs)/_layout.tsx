import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Colors } from "../../constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          borderTopLeftRadius: 27,
          borderTopRightRadius: 27,
        },
        tabBarLabelStyle: {
          fontFamily: "System",
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Watch",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="media-library"
        options={{
          title: "Media Library",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
