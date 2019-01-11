import React, { Component } from "react";
import { ScrollView, StyleSheet, View, FlatList, Text } from "react-native";
import { connect } from "react-redux";
import { List, Divider, IconButton, Searchbar } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { bindActionCreators } from "redux";
import moment from "moment";
import { selectNote, toggleFavorites } from "../actions/notesActions";
import { setQuery } from "../actions/filterActions";
import { reminders, remindersWithQuery } from "../selectors/rootSelector";
class Reminders extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: "Pripomienky",
      headerStyle: {
        backgroundColor: "#1a72b4"
      },
      headerTintColor: "white",
      headerTitleStyle: {
        color: "white"
      }
    };
  };
  constructor(props) {
    super(props);

    this.state = {
      firstQuery: ""
    };
  }

  render() {
    return (
      <View>
        <Searchbar
          placeholder="Vyhľadať"
          onChangeText={query => {
            this.setState({ firstQuery: query });
            this.props.setQuery(query);
          }}
          onIconPress={query => {
            this.setState({ firstQuery: query });
            this.props.setQuery(query);
          }}
          value={this.state.firstQuery}
        />
        <ScrollView style={styles.scrollStyle}>
          <FlatList
            data={
              this.state.firstQuery === ""
                ? this.props.reminders
                : this.props.remindersQuery
            }
            style={styles.listitemStyle}
            renderItem={({ item }) => (
              <Animatable.View animation="slideInLeft">
                <List.Item
                  key={item.key}
                  title={item.title}
                  description={
                    item.text
                      ? item.text
                      : item.list.length >= 3
                      ? `${item.list[0].text}, ${item.list[1].text}, ${
                          item.list[2].text
                        }...`
                      : `${item.list[0].text + "..."}`
                  }
                  style={
                    item.color && item.color !== "#1a72b4"
                      ? { backgroundColor: `${item.color}`, opacity: 0.9 }
                      : { backgroundColor: `#ffffff` }
                  }
                  onPress={() => {
                    this.props.selectNote(item);
                    this.props.navigation.navigate("Details", {
                      title: item.title,
                      color: item.color,
                      id: item.key
                    });
                  }}
                  left={props => (
                    <List.Icon
                      style={styles.iconStyle}
                      {...props}
                      icon={item.text ? "note" : "list"}
                    />
                  )}
                  right={props => (
                    <View>
                      <Animatable.View
                        animation={item.star ? "zoomIn" : undefined}
                      >
                        <IconButton
                          {...props}
                          color={item.star ? "gold" : "gray"}
                          icon="star"
                          onPress={() => {
                            console.log("pressed", item.title);
                            this.props.toggleFavorites(
                              { star: !item.star },
                              item.key
                            );
                          }}
                        />
                      </Animatable.View>
                      <Text style={{ textAlign: "center" }}>
                        {moment(item.date).format("DD/MM")}
                      </Text>
                    </View>
                  )}
                />
                <Divider />
              </Animatable.View>
            )}
          />
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  scrollStyle: {
    lineHeight: 1
  }
});

const mapStateToProps = state => {
  return {
    notes: state.notes,
    reminders: reminders(state),
    remindersQuery: remindersWithQuery(state)
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      selectNote: selectNote,
      toggleFavorites: toggleFavorites,
      setQuery: setQuery
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reminders);
