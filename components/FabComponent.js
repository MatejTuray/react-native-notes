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
            theme={{ colors: { accent: this.props.theme.secondary } }}
            actions={[
              {
                icon: "note-add",
                label: "Vytvoriť poznámku",
                style: {
                  backgroundColor: this.props.theme.secondary
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
                  backgroundColor: this.props.theme.secondary
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
                  backgroundColor: this.props.theme.secondary
                },
                onPress: () =>
                  this.props.navigation.navigate("Letaky", {
                    primary: this.props.theme.primary,
                    secondary: this.props.theme.secondary
                  })
              },
              {
                icon: "notifications",
                label: "Pripomienky",
                style: {
                  backgroundColor: this.props.theme.secondary
                },
                onPress: () =>
                  this.props.navigation.navigate("Reminders", {
                    primary: this.props.theme.primary,
                    secondary: this.props.theme.secondary
                  })
              },
              {
                icon: "settings",
                label: "Nastavenia",
                style: {
                  backgroundColor: this.props.theme.secondary
                },
                onPress: () =>
                  this.props.navigation.navigate("Settings", {
                    primary: this.props.theme.primary,
                    secondary: this.props.theme.secondary
                  })
              },
              {
                icon: "home",
                label: "Domov",
                style: {
                  backgroundColor: this.props.theme.secondary
                },
                onPress: () => this.props.navigation.navigate("Home")
              },
              {
                icon: "settings-power",
                label: "Vypnúť",
                style: {
                  backgroundColor: this.props.theme.secondary
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
    color: "white",
    marginBottom: 0,
    paddingBottom: 100
  }
});

const mapStateToProps = state => {
  return {
    fab: state.fab,
    title: state.title,
    cache: state.cache,
    theme: state.theme
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
