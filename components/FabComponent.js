import * as React from "react";
import { FAB, Portal } from "react-native-paper";
import { StyleSheet, BackHandler } from "react-native";
import FABToggle from "../actions/FABActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
export class FabComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }
  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <Portal style={styles.PortalStyle}>
        {this.props.fab === true ? (
          <FAB.Group
            style={styles.fabStyle}
            open={this.state.open}
            icon={this.state.open ? "today" : "menu"}
            theme={{ colors: { accent: "#B41A34" } }}
            actions={[
              {
                icon: "note-add",
                label: "Vytvoriť poznámku",
                style: {
                  backgroundColor: "#B41A34"
                },
                onPress: () =>
                  this.props.navigation.navigate("CreateNote", {
                    edit: false,
                    titleText: this.props.title,
                    color: this.props.cache.note_color
                  })
              },
              {
                icon: "list",
                label: "Vytvoriť zoznam",
                style: {
                  backgroundColor: "#B41A34"
                },
                onPress: () => {
                  this.props.navigation.navigate("CreateShoppingList", {
                    edit: false,
                    titleText: this.props.title,
                    color: this.props.cache.list_color
                  });
                  console.log(this.props.cache.list_color);
                }
              },
              {
                icon: "book",
                label: "Letáky",
                style: {
                  backgroundColor: "#B41A34"
                },
                onPress: () => this.props.navigation.navigate("Letaky")
              },
              {
                icon: "notifications",
                label: "Pripomienky",
                style: {
                  backgroundColor: "#B41A34"
                },
                onPress: () => this.props.navigation.navigate("Reminders")
              },
              {
                icon: "settings",
                label: "Nastavenia",
                style: {
                  backgroundColor: "#B41A34"
                },
                onPress: () => this.props.navigation.navigate("Settings")
              },
              {
                icon: "home",
                label: "Domov",
                style: {
                  backgroundColor: "#B41A34"
                },
                onPress: () => this.props.navigation.navigate("Home")
              },
              {
                icon: "settings-power",
                label: "Vypnúť",
                style: {
                  backgroundColor: "#B41A34"
                },
                onPress: () => BackHandler.exitApp()
              }
            ]}
            onStateChange={({ open }) => this.setState({ open })}
            onPress={() => {
              if (this.state.open) {
                // do something if the speed dial is open
              }
            }}
          />
        ) : (
          undefined
        )}
      </Portal>
    );
  }
}
const styles = StyleSheet.create({
  fabStyle: {
    paddingBottom: 90,
    marginBottom: 0
  },
  PortalStyle: {
    color: "#aa6a39",
    marginBottom: 0,
    paddingBottom: 90
  }
});

const mapStateToProps = state => {
  return {
    fab: state.fab,
    title: state.title,
    cache: state.cache
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      FABToggle: FABToggle
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FabComponent);
