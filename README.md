# react-componet-carousel

> Display react components inside a carousel on mobile devices

## Install

```sh
npm install react-component-carousel
```

## Use

```js
var Carousel = require('react-component-carousel');
var MyBox = require('./path/to/my/box.jsx');

var MyComponent = React.createClass({
  render: function () {
    return (
      <Carousel>
        <MyBox text="first"/>
        <MyBox text="second"/>
        <MyBox text="third"/>
      </Carousel>
    )
  }
});
```

# Children

All children put inside the carousel are swipable.

# License

MIT