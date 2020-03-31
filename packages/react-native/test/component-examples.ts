const NormalButtonComponent: string = `
import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

class NormalButton extends Component {
  render() {
    const { text, backgroundColor, width, height, style } = this.props;
    return (
      <Button
        title={text.toUpperCase()}
        raised={true}
        onPress={() => this.props.onPress()}
        buttonStyle={{
          height,
          width,
          //borderRadius: width * 2,
          //backgroundColor,
          ...style,
        }}
      />
    );
  }
}

NormalButton.propTypes = {
  text: PropTypes.string,
  backgroundColor: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  onPress: PropTypes.func,
  style: PropTypes.object,
};

NormalButton.defaultProps = {
  text: 'Button',
  backgroundColor: '#fafafa',
  width: 120,
  height: 50,
  style: {},
};

export default NormalButton;
`;

const CardComponent: string = `
import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { StyleSheet, Text, View, TouchableWithoutFeedback, Animated, Image } from 'react-native';
import backCardImage from '../assets/images/carte-dos-2.png';

class Card extends Component {
  getColor = suit => {
    if (suit === 'spades' || suit === 'clubs') {
      return styles.black;
    } else {
      return styles.red;
    }
  };

  getSuitSymbol = suit => {
    /*
     * spades ♠
     * clubs ♣
     * diamonds ♦
     * hearts ♥
     */
    switch (suit) {
      case 'spades':
        return '♠';
        break;
      case 'clubs':
        return '♣';
        break;
      case 'diamonds':
        return '♦';
        break;
      case 'hearts':
        return '♥';
        break;
      default:
        return '';
        break;
    }
  };

  UNSAFE_componentWillMount() {
    const hiddenValue = this.props.hidden ? 180 : 0;
    this.animatedValue = new Animated.Value(hiddenValue);
    this.value = hiddenValue;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });
  }

  flipCard() {
    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
      }).start();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
      }).start();
    }
  }

  render() {
    const frontAnimatedStyle = {
      transform: [{ rotateY: this.frontInterpolate }],
    };
    const backAnimatedStyle = {
      transform: [{ rotateY: this.backInterpolate }],
    };
    const { value, suit, hidden, style } = this.props;
    const color = this.getColor(suit);
    return (
      <TouchableWithoutFeedback onPress={() => this.flipCard()}>
        <View style={[styles.card, style]}>
          <Animated.View style={[styles.flipCard, styles.flipCardFront, frontAnimatedStyle]}>
            <Text style={[styles.valueText, color]}>{value}</Text>
            <Text style={[styles.suitText, color]}>{this.getSuitSymbol(suit)}</Text>
          </Animated.View>
          <Animated.View style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle]}>
            <Image source={backCardImage} style={styles.backImage} />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: 85,
    height: 103.85,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  flipCard: {
    width: 85,
    height: 103.85,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 8,
  },
  flipCardFront: {
    backgroundColor: 'white',
  },
  flipCardBack: {
    position: 'absolute',
    top: 0,
  },
  backImage: {
    width: '100%',
    height: '100%',
  },
  suitText: {
    fontSize: 62,
    position: 'absolute',
    bottom: 0,
  },
  valueText: {
    position: 'absolute',
    top: 5,
    left: 8,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  black: {
    color: 'black',
  },
  red: {
    color: 'red',
  },
});

Card.propTypes = {
  value: PropTypes.string.isRequired,
  suit: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  style: PropTypes.object,
};

Card.defaultProps = {
  hidden: false,
  style: {},
};

export default Card;
`;

const InputComponent: string = `
import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TextInput,
  Animated,
  Easing,
  Platform,
  StyleSheet,
} from 'react-native';

import { nodeType, renderNode, patchWebProps } from '../helpers';
import { fonts, withTheme, ViewPropTypes, TextPropTypes } from '../config';

import Icon from '../icons/Icon';

const renderText = (content, defaultProps, style) =>
  renderNode(Text, content, {
    ...defaultProps,
    style: StyleSheet.flatten([style, defaultProps && defaultProps.style]),
  });

class Input extends React.Component {
  shakeAnimationValue = new Animated.Value(0);

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  clear() {
    this.input.clear();
  }

  isFocused() {
    return this.input.isFocused();
  }

  setNativeProps(nativeProps) {
    this.input.setNativeProps(nativeProps);
  }

  shake = () => {
    const { shakeAnimationValue } = this;

    shakeAnimationValue.setValue(0);
    // Animation duration based on Material Design
    // https://material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations
    Animated.timing(shakeAnimationValue, {
      duration: 375,
      toValue: 3,
      ease: Easing.bounce,
    }).start();
  };

  render() {
    const {
      containerStyle,
      disabled,
      disabledInputStyle,
      inputContainerStyle,
      leftIcon,
      leftIconContainerStyle,
      rightIcon,
      rightIconContainerStyle,
      inputComponent: InputComponent = TextInput,
      inputStyle,
      errorProps,
      errorStyle,
      errorMessage,
      label,
      labelStyle,
      labelProps,
      theme,
      ...attributes
    } = this.props;

    const translateX = this.shakeAnimationValue.interpolate({
      inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3],
      outputRange: [0, -15, 0, 15, 0, -15, 0],
    });

    return (
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
        {renderText(
          label,
          { style: labelStyle, ...labelProps },
          styles.label(theme)
        )}

        <Animated.View
          style={StyleSheet.flatten([
            styles.inputContainer(theme),
            inputContainerStyle,
            { transform: [{ translateX }] },
          ])}
        >
          {leftIcon && (
            <View
              style={StyleSheet.flatten([
                styles.iconContainer,
                leftIconContainerStyle,
              ])}
            >
              {renderNode(Icon, leftIcon)}
            </View>
          )}

          <InputComponent
            testID="RNE__Input__text-input"
            underlineColorAndroid="transparent"
            editable={!disabled}
            {...patchWebProps(attributes)}
            ref={ref => {
              this.input = ref;
            }}
            style={StyleSheet.flatten([
              styles.input,
              inputStyle,
              disabled && styles.disabledInput,
              disabled && disabledInputStyle,
            ])}
          />

          {rightIcon && (
            <View
              style={StyleSheet.flatten([
                styles.iconContainer,
                rightIconContainerStyle,
              ])}
            >
              {renderNode(Icon, rightIcon)}
            </View>
          )}
        </Animated.View>

        {!!errorMessage && (
          <Text
            {...errorProps}
            style={StyleSheet.flatten([
              styles.error(theme),
              errorStyle && errorStyle,
            ])}
          >
            {errorMessage}
          </Text>
        )}
      </View>
    );
  }
}

Input.propTypes = {
  containerStyle: ViewPropTypes.style,
  disabled: PropTypes.bool,
  disabledInputStyle: TextPropTypes.style,
  inputContainerStyle: ViewPropTypes.style,
  leftIcon: nodeType,
  leftIconContainerStyle: ViewPropTypes.style,
  rightIcon: nodeType,
  rightIconContainerStyle: ViewPropTypes.style,
  inputStyle: TextPropTypes.style,
  inputComponent: PropTypes.elementType,
  errorProps: PropTypes.object,
  errorStyle: TextPropTypes.style,
  errorMessage: PropTypes.string,
  label: PropTypes.node,
  labelStyle: TextPropTypes.style,
  labelProps: PropTypes.object,
  theme: PropTypes.object,
};

const styles = {
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  disabledInput: {
    opacity: 0.5,
  },
  inputContainer: theme => ({
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    borderColor: theme.colors.grey3,
  }),
  iconContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  input: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 18,
    flex: 1,
    minHeight: 40,
  },
  error: theme => ({
    margin: 5,
    fontSize: 12,
    color: theme.colors.error,
  }),
  label: theme => ({
    fontSize: 16,
    color: theme.colors.grey3,
    ...Platform.select({
      android: {
        ...fonts.android.bold,
      },
      default: {
        fontWeight: 'bold',
      },
    }),
  }),
};

export { Input };
export default withTheme(Input, 'Input');
`;
export { NormalButtonComponent, CardComponent, InputComponent };
