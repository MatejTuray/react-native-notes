import React, { Component } from "react";
import Home from "../components/Home";
import Details from "../components/Details";
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from "react-navigation";
import CreateNote from "../components/CreateNote";
import CreateShoppingList from "../components/CreateShoppingList";
import { connect } from "react-redux";
import Letaky from "../components/Letaky";
import Reminders from "../components/Reminders";
import Synch from "../components/Synch";
import Migrate from "../components/Migrate";
import Settings from "../components/Settings";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
const SettingsTabs = createMaterialBottomTabNavigator(
  {
    Nastavenia: Settings,
    Synchronizácia: Synch,
    Export: Migrate
  },
  { shifting: true, barStyle: { backgroundColor: "#1a72b4" } }
);

SettingsTabs.navigationOptions = ({ navigation }) => {
  let title;
  let focusedRouteName =
    navigation.state.routes[navigation.state.index].routeName;
  if (focusedRouteName === "Synchronizácia") {
    title = "Synchronizovať";
  } else if (focusedRouteName === "Nastavenia") {
    title = "Nastavenia";
  } else if ((focusedRouteName = "Export")) {
    title = "Export";
  }

  return {
    title,
    headerStyle: {
      backgroundColor: "#1a72b4"
    },
    headerTintColor: "white",
    headerTitleStyle: {
      color: "white"
    }
  };
};

const RootStack = createStackNavigator(
  {
    Home: { screen: Home, path: "home/", navigationOptions: {} },

    CreateNote: {
      screen: CreateNote,
      path: "createnote/",
      navigationOptions: {}
    },
    CreateShoppingList: {
      screen: CreateShoppingList,
      path: "createlist/",
      navigationOptions: {}
    },
    Details: { screen: Details, path: "details/:id", navigationOptions: {} },
    Letaky: { screen: Letaky, path: "letaky" },
    Reminders: { screen: Reminders, path: "reminders" },
    Settings: SettingsTabs,

    HomeSelected: {
      screen: Home,
      navigationOptions: {
        title: `Selected items`,
        headerStyle: {
          backgroundColor: "grey"
        },
        headerTintColor: "white",
        headerTitleStyle: {
          color: "white"
        }
      }
    }
  },
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(RootStack);

export default AppContainer;
