import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { Icon } from './Icon';
import { Caption, Subtitle } from './Text';
import { TouchableOpacity } from './TouchableOpacity';
import { View } from './View';

const DESCRIPTION_LENGTH_TRIM_LIMIT = 90;

/**
 * An overlay that is intended to be rendered above
 * images in a gallery. It can display a title and
 * a description of an image.
 */
class ImageGalleryOverlay extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      isDescriptionCollapsed: true,
    };
  }

  onDescriptionScroll(event) {
    const { isDescriptionCollapsed } = this.state;
    const offsetY = event.nativeEvent.contentOffset.y;

    // We are expanding and collapsing the description when
    // the user swipes the description in the correct direction.
    if (isDescriptionCollapsed && offsetY > 0) {
      this.expandDescription();
    } else if (!isDescriptionCollapsed && offsetY < 0) {
      this.collapseDescription();
    }
  }

  collapseDescription() {
    this.setState({ isDescriptionCollapsed: true });
  }

  expandDescription() {
    this.setState({ isDescriptionCollapsed: false });
  }

  renderTitle(title) {
    const { style } = this.props;

    if (!title) {
      return null;
    }

    return (
      <View style={style.title.container}>
        <Subtitle style={style.title.text} numberOfLines={2}>
          {title}
        </Subtitle>
      </View>
    );
  }

  renderDescription(description) {
    const { style } = this.props;
    const { isDescriptionCollapsed: collapsed } = this.state;

    if (!description) {
      return null;
    }

    const descriptionIcon = (
      <Icon name={`${collapsed ? 'up' : 'down'}-arrow`} />
    );

    const descriptionText = (
      <Caption
        style={style.description.text}
        numberOfLines={collapsed ? 2 : null}
      >
        {description}
      </Caption>
    );

    return (
      <View
        styleName={collapsed ? 'collapsed' : 'expanded'}
        style={style.description.container}
      >
        <TouchableOpacity
          onPress={
            collapsed ? this.expandDescription : this.collapseDescription
          }
          hitSlop={{
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          }}
        >
          {description.length >= DESCRIPTION_LENGTH_TRIM_LIMIT
            ? descriptionIcon
            : null}
        </TouchableOpacity>
        <ScrollView
          style={style.description.scroll}
          onScroll={this.onDescriptionScroll}
          scrollEventThrottle={1000}
        >
          {descriptionText}
        </ScrollView>
      </View>
    );
  }

  render() {
    const { title, description, style } = this.props;

    if (!title && !description) {
      return null;
    }

    return (
      <View style={style.container} pointerEvents="box-none">
        {this.renderTitle(title)}
        {this.renderDescription(description)}
      </View>
    );
  }
}

ImageGalleryOverlay.propTypes = {
  style: PropTypes.object.isRequired,
  description: PropTypes.string,
  title: PropTypes.string,
};

ImageGalleryOverlay.defaultProps = {
  description: undefined,
  title: undefined,
};

const AnimatedOverlay = connectAnimation(ImageGalleryOverlay);
const StyledOverlay = connectStyle('shoutem.ui.ImageGalleryOverlay', {
  container: {},
  title: {
    container: {},
    text: {},
  },
  description: {
    container: {},
    scroll: {},
    text: {},
  },
})(AnimatedOverlay);
export { StyledOverlay as ImageGalleryOverlay };
