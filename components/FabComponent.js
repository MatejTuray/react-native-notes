import * as React from "react";
import { FAB, Portal } from "react-native-paper";
import { StyleSheet, BackHandler } from "react-native";
export default class FabComponent extends React.Component {
  state = {
    open: false
  };

  render() {
    return (
      
      <Portal style={styles.PortalStyle}>
        {this.props.hide !== true ? 
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
                  titleText: "Poznámka bez názvu"
                })
            },
            {
              icon: "list",
              label: "Vytvoriť zoznam",
              style: {
                backgroundColor: "#B41A34"
              },
              onPress: () =>
                this.props.navigation.navigate("CreateShoppingList", {
                  edit: false,
                  titleText: "Zoznam bez názvu"
                })
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
        /> : undefined}
      </Portal>
    );
  }
}
const styles = StyleSheet.create({
  fabStyle: {
    paddingBottom: 90,
    marginBottom: 0,
    
  },
  PortalStyle: {
    color: "#aa6a39",
    marginBottom: 0,
    paddingBottom: 90,
   
  }
});
