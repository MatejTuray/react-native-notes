import React, { Component } from 'react'
import Home from "../components/Home"
import Details from "../components/Details"
import { createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
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

const RootDrawer = createDrawerNavigator({
  Close : {screen: RootStack}
})

const AppNav = createStackNavigator({
  Drawer: {
    screen: RootDrawer,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  }
}, { headerMode: 'none' })

const AppContainer = createAppContainer(AppNav);




export default AppContainer