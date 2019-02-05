import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import TouchableBounce from "react-native/Libraries/Components/Touchable/TouchableBounce";
import { MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
const tabBarIcon = name => ({ tintColor, horizontal }) => (
  <MaterialIcons name={name} color={tintColor} size={horizontal ? 17 : 24} />
);
import {
  TextInput,
  Button,
  HelperText,
  Divider,
  Heading
} from "react-native-paper";
import StepIndicator from "react-native-step-indicator";
import { List, RadioButton, Modal, Portal } from "react-native-paper";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { ScrollView } from "react-native-gesture-handler";
import Slider from "react-native-slider";
import { ToastAndroid } from "react-native";
import { bindActionCreators } from "redux";
import FABToggle from "../actions/FABActions";
const labels = ["E-mail", "Telefón", "Platnosť linku", "Potvrdenie"];
const regex = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
class Migrate extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      tabBarIcon: tabBarIcon("cloud-upload"),
      tabBarButtonComponent: TouchableBounce,
      tabBarColor: params.primary
    };
  };
  constructor(props) {
    super(props);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePhone = this.validatePhone.bind(this);
    this.validateRadio = this.validateRadio.bind(this);
    this.validateProgress = this.validateProgress.bind(this);
    this.validateAndSend = this.validateAndSend.bind(this);
    this._showModal = this._showModal.bind(this);
    this._hideModal = this._hideModal.bind(this);
    this.state = {
      currentPage: 0,
      email: "",
      phone: "",
      emailValid: true,
      phoneValid: true,
      value: 0,
      duration: 0,
      visible: false
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      primary: this.props.theme.primary,
      secondary: this.props.theme.secondary
    });
    this.props.FABToggle();
  }
  componentDidMount() {
    ToastAndroid.showWithGravityAndOffset(
      "Váš e-mail a telefónne číslo je použité len na zabezpečenie migrácie Vašich údajov do iných zariadení",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      170
    );
    setTimeout(() => this.props.FABToggle(), 4000);
  }
  validateEmail(email) {
    this.setState({
      emailValid: regex.test(String(email).toLowerCase())
    });
    if (regex.test(String(email).toLowerCase())) {
      this.setState({ currentPage: 1 });
    } else {
      this.setState({ currentPage: 0 });
    }
  }
  validatePhone(phone) {
    let phoneNum = parsePhoneNumberFromString(phone, "SK");
    if (phoneNum.isValid() && phoneNum.getType() === "MOBILE") {
      this.setState({
        phoneValid: true,
        phone: phoneNum.formatNational()
      });
      if (this.state.email !== "" && this.state.emailValid) {
        this.setState({
          currentPage: 2
        });
      }
    } else {
      this.setState({
        phoneValid: false,
        currentPage: 1
      });
    }
  }
  validateRadio() {
    if (
      this.state.value !== 0 &&
      this.state.duration !== 0 &&
      this.state.email !== "" &&
      this.state.emailValid &&
      this.state.phone !== "" &&
      this.state.phoneValid
    ) {
      return true;
    } else {
      return false;
    }
  }
  validateProgress() {
    if (
      this.state.email !== "" &&
      this.state.emailValid &&
      this.state.phone !== "" &&
      this.state.phoneValid
    ) {
      return true;
    } else {
      return false;
    }
  }
  validateAndSend() {
    let res = regex.test(String(this.state.email).toLowerCase());
    let phoneNum = parsePhoneNumberFromString(this.state.phone, "SK");
    if (
      res &&
      phoneNum.isValid() &&
      this.validateProgress() &&
      this.state.value !== 0 &&
      this.state.duration !== 0
    ) {
      let payload = {
        mail: this.state.email,
        number: this.state.phone,
        value: this.state.value,
        duration: this.state.duration,
        notes: this.props.notes.present
      };
      console.log(payload);
      this.setState({
        currentPage: 4,
        loading: true
      });
    }
  }
  _showModal = () => this.setState({ visible: true });
  _hideModal = () => this.setState({ visible: false });
  render() {
    const stepIndicatorStyles = {
      stepIndicatorSize: 30,
      currentStepIndicatorSize: 40,
      separatorStrokeWidth: 3,
      currentStepStrokeWidth: 5,
      stepStrokeCurrentColor: this.props.theme.primary,
      separatorFinishedColor: this.props.theme.primary,
      separatorUnFinishedColor: "#aaaaaa",
      stepIndicatorFinishedColor: this.props.theme.primary,
      stepIndicatorUnFinishedColor: "#aaaaaa",
      stepIndicatorCurrentColor: "#ffffff",
      stepIndicatorLabelFontSize: 15,
      currentStepIndicatorLabelFontSize: 15,
      stepIndicatorLabelCurrentColor: "#000000",
      stepIndicatorLabelFinishedColor: "#ffffff",
      stepIndicatorLabelUnFinishedColor: this.props.theme.primary,
      labelColor: "#666666",
      labelSize: 15,
      currentStepLabelColor: this.props.theme.primary
    };

    return (
      <ScrollView style={styles.container}>
        <View>
          <List.Section title="Export umožnuje presunúť dáta z tohto zariadenia" />
        </View>
        <View style={styles.step}>
          <StepIndicator
            customStyles={stepIndicatorStyles}
            stepCount={4}
            direction="horizontal"
            currentPosition={this.state.currentPage}
            labels={labels}
          />
        </View>
        <View style={styles.formStyle}>
          <View>
            <TextInput
              theme={{ colors: { primary: this.props.theme.primary } }}
              label="Email"
              mode="flat"
              error={!this.state.emailValid}
              value={this.state.email}
              style={{ marginTop: 5, backgroundColor: "#ffffff" }}
              onChangeText={email => {
                this.setState({ email });
              }}
              onSubmitEditing={() => {
                this.setState({ email: this.state.email.toLowerCase() });
                this.validateEmail(this.state.email);
              }}
            />
            <HelperText type="error" visible={!this.state.emailValid}>
              Prosím zadajte platnú e-mailovú adresu
            </HelperText>
          </View>
          <View>
            <TextInput
              label="Číslo mobilného telefónu"
              mode="flat"
              theme={{ colors: { primary: this.props.theme.primary } }}
              error={!this.state.phoneValid}
              keyboardType="phone-pad"
              style={{ marginTop: 5, backgroundColor: "#ffffff" }}
              value={this.state.phone}
              onChangeText={phone => {
                this.setState({ phone });
              }}
              onSubmitEditing={() => {
                this.setState({ phone: this.state.phone });
                this.validatePhone(this.state.phone);
              }}
            />
            <HelperText type="error" visible={!this.state.phoneValid}>
              Prosím zadajte platné mobilné číslo pre SR
            </HelperText>
          </View>
          <View>
            <RadioButton.Group
              onValueChange={value => {
                if (value > 0) {
                  this.validateRadio();
                }
                this.setState({ value });
              }}
              value={this.state.value}
            >
              <List.Item
                title={"Jednorazový link"}
                style={{ marginBottom: 5 }}
                onLongPress={() => {
                  console.log("press");
                }}
                onPress={() => {
                  if (this.validateProgress()) {
                    this.setState({
                      duration: -1,
                      value: 1,
                      currentPage: 3,
                      pickerVisible: false
                    });
                  }
                }}
                left={props => (
                  <View style={styles.radio}>
                    <RadioButton
                      {...props}
                      color={this.props.theme.secondary}
                      uncheckedColor="gray"
                      value={1}
                      disabled={!this.validateProgress()}
                      onPress={() => {
                        if (this.validateProgress()) {
                          this.setState({
                            duration: -1,
                            value: 1,
                            currentPage: 3,
                            pickerVisible: false
                          });
                          this.validateRadio();
                        }
                      }}
                    />
                  </View>
                )}
              />
              <List.Item
                title={
                  this.state.duration === 0 || this.state.duration === -1
                    ? "Link s dobou platnosti (max 7 dní)"
                    : this.state.duration === 1
                    ? "Link s dobou platnosti 1 deň"
                    : `Link s dobou platnosti ${this.state.duration} dní`
                }
                onLongPress={() => {
                  console.log("press");
                }}
                onPress={() => {
                  if (this.validateProgress()) {
                    this.setState({
                      duration: 1,
                      value: 2,
                      pickerVisible: true,
                      currentPage: 3
                    });
                  }
                }}
                left={props => (
                  <View style={styles.radio}>
                    <RadioButton
                      {...props}
                      color={this.props.theme.secondary}
                      disabled={!this.validateProgress()}
                      value={2}
                      onPress={() => {
                        if (this.validateProgress()) {
                          this.setState({
                            duration: 1,
                            value: 2,
                            pickerVisible: true,
                            currentPage: 3
                          });
                        }
                      }}
                    />
                  </View>
                )}
              />
            </RadioButton.Group>
            {this.state.pickerVisible ? (
              <View
                style={{
                  flex: 1,
                  marginLeft: 20,
                  marginRight: 20,
                  alignItems: "stretch",
                  justifyContent: "center"
                }}
              >
                <Slider
                  value={this.state.duration}
                  onValueChange={duration => this.setState({ duration })}
                  minimumValue={1}
                  maximumValue={7}
                  step={1}
                  thumbTintColor={this.props.theme.secondary}
                  trackStyle={{ backgroundColor: this.props.theme.primary }}
                />
              </View>
            ) : (
              undefined
            )}
          </View>

          <Button
            loading={this.state.loading}
            color={this.props.theme.primary}
            style={{
              marginTop: 5,
              marginHorizontal: 50
            }}
            mode="contained"
            onPress={() => this.validateAndSend()}
          >
            Potvrdiť
          </Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  formStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    marginHorizontal: 30
  },
  step: {
    marginTop: 10,
    margin: 0
  },
  modalStyle: {
    justifyContent: "center",
    alignItems: "center"
  },
  boxStyle: {
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20
  }
});
const mapStateToProps = state => {
  return {
    theme: state.theme,
    notes: state.notes
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
)(Migrate);
