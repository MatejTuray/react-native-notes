import React, { Component } from 'react'
import Home from "../components/Home"

import { createStackNavigator, createAppContainer } from "react-navigation";
import CreateNote from '../components/CreateNote';
import CreateShoppingList from "../components/CreateShoppingList";
const RootStack = createStackNavigator(
  {
    Home: {screen: Home, navigationOptions: {
      title: "Home", 
      headerStyle: {
        backgroundColor: '#1a72b4',
      },
      headerTintColor: "white",
      headerTitleStyle: {
        color: "white"
      }
     
    } },
    CreateNote: {screen: CreateNote, navigationOptions: {
      title: "Create a note",
      headerStyle: {
        backgroundColor: '#1a72b4',
      },
      headerTintColor: "white",
      headerTitleStyle: {
        color: "white"
      }
  }},
  CreateShoppingList: {screen: CreateShoppingList, navigationOptions: {
    title: "Create a list",
    headerStyle: {
      backgroundColor: '#1a72b4',
    },
    headerTintColor: "white",
    headerTitleStyle: {
      color: "white"
    }
}}
},
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(RootStack);


export default AppContainer