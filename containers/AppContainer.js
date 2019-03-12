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

import Letaky from "../components/Letaky";
import Reminders from "../components/Reminders";
import Synch from "../components/Synch";
import Migrate from "../components/Migrate";
import Settings from "../components/Settings";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { connect } from "react-redux";
const SettingsTabs = createMaterialBottomTabNavigator(
  {
    Témy: Settings,
    Export: Migrate
  },
  {
    shifting: true
  }
);

SettingsTabs.navigationOptions = ({ navigation }) => {
  let title;
  let focusedRouteName =
    navigation.state.routes[navigation.state.index].routeName;
  if (focusedRouteName === "Synchronizácia") {
    title = "Synchronizovať";
  } else if (focusedRouteName === "Témy") {
    title = "Témy";
  } else if ((focusedRouteName = "Export")) {
    title = "Export";
  }

  return {
    title,
    headerStyle: {
      backgroundColor: navigation.state.params.primary
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
    initialRouteName: "Home",
    initialRouteParams: { primary: "ffffff" }
  }
);

const Wrapper = createAppContainer(RootStack);

const AppContainer = props => {
  console.log(props);
  return <Wrapper {...props} key={props.theme.key} />;
};

const mapStateToProps = (state, ownProps) => {
  return {
    theme: state.theme
  };
};

export default connect(mapStateToProps)(AppContainer);
