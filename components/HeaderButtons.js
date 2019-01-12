import * as React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { HeaderButtons, HeaderButton } from "react-navigation-header-buttons";
const uuidv4 = require("uuid/v4");

const MaterialHeaderButton = props => (
  <HeaderButton
    {...props}
    key={uuidv4()}
    IconComponent={MaterialIcons}
    iconSize={24}
    color="white"
  />
);

export const MaterialHeaderButtons = props => {
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
      OverflowIcon={
        <MaterialIcons key={uuidv4()} name="more-vert" size={24} color="blue" />
      }
      {...props}
    />
  );
};
export const Item = HeaderButtons.Item;
