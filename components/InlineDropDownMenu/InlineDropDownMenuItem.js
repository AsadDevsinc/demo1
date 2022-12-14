import React, { PureComponent } from 'react';
import { Animated, Dimensions, Pressable } from 'react-native';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '../Text';

const window = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

class InlineDropDownMenuItem extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    const { index } = this.props;

    Animated.timing(this.animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      duration: 300 + index * 15,
    }).start();
  }

  handlePress() {
    const { onItemPressed, item } = this.props;

    if (onItemPressed) {
      onItemPressed(item);
    }
  }

  render() {
    const { isSelected, selectedDescriptor, item, style } = this.props;

    const resolvedText = isSelected
      ? `${item.title} (${selectedDescriptor})`
      : item.title;
    const textStyle = isSelected ? 'muted' : '';

    return (
      <AnimatedPressable
        style={[
          style.container,
          {
            transform: [
              {
                translateX: this.animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [window.width, 0],
                }),
              },
            ],
          },
        ]}
        disabled={isSelected}
        onPress={this.handlePress}
      >
        <Text styleName={textStyle}>{resolvedText}</Text>
      </AnimatedPressable>
    );
  }
}

InlineDropDownMenuItem.propTypes = {
  style: PropTypes.isRequired,
  index: PropTypes.number,
  isSelected: PropTypes.bool,
  item: PropTypes.object,
  selectedDescriptor: PropTypes.string,
  onItemPressed: PropTypes.func,
};

InlineDropDownMenuItem.defaultProps = {
  index: undefined,
  isSelected: false,
  item: undefined,
  selectedDescriptor: undefined,
  onItemPressed: undefined,
};

const StyledComponent = connectStyle('shoutem.ui.InlineDropDownMenuItem')(
  InlineDropDownMenuItem,
);

export { StyledComponent as InlineDropDownMenuItem };
