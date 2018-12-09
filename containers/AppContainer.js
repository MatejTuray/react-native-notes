import React, { Component } from 'react'
import Home from "../components/Home"
import Details from "../components/Details"
import { createStackNavigator, createAppContainer } from "react-navigation";
import CreateNote from '../components/CreateNote';
import CreateShoppingList from "../components/CreateShoppingList";
import {connect} from "react-redux"

const RootStack = createStackNavigator(
  {
    Home: {screen: Home, navigationOptions: {      
      
     
    } },
    CreateNote: {screen: CreateNote, navigationOptions: {
     
  }},
  CreateShoppingList: {screen: CreateShoppingList, navigationOptions: {
  
}},
Details: {screen: Details, navigationOptions: {
  
}},

  HomeSelected: {screen: Home, navigationOptions: {
    title: `Selected items`, 
    headerStyle: {
      backgroundColor: 'grey',
    },
    headerTintColor: "white",
    headerTitleStyle: {
      color: "white"
    }
  
  } },
},
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(RootStack);




export default AppContainer