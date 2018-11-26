import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import moment from "moment";
import FabComponent from './FabComponent';

export default class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  
  
    render() {
         
      return (
        
           
        <View style={styles.container}>
     
          <View style={styles.headerStyle}>
          <Text style={styles.textStyle}>Your notes for {moment(new Date()).format("LLL")}: </Text>               
              </View>   
              <View style={styles.container}><FabComponent navigation={this.props.navigation}/></View>    
            
        </View>
  
       
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
    },
    textStyle:{
      marginTop: 20,
      alignSelf: "center",
      marginBottom: 20,
    },
    navBarStyle:{
      marginTop: 55,
      paddingTop: 15,
    },
    headerStyle:{
        display: "flex",
        justifyContent: "center",
        shadowOffset:{  width: 10,  height: 10,  },
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        
            }
    
  
    
  });
