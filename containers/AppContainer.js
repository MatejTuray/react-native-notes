import React, { Component } from 'react'
import Home from "../components/Home"
import Details from "../components/Details"
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import CreateNote from '../components/CreateNote';
import CreateShoppingList from "../components/CreateShoppingList";
import {connect} from "react-redux"


const RootStack = createStackNavigator(
  {
    Home: {screen: Home, path:"home/", navigationOptions: {      
      
     
    } },
   
    CreateNote: {screen: CreateNote, path:"createnote/", navigationOptions: {
     
  }},
  CreateShoppingList: {screen: CreateShoppingList, path:"createlist/",navigationOptions: {
  
}},
Details: {screen: Details, path:"details/:id", navigationOptions: {
  
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