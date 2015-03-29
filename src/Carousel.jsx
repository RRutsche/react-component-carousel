var React = require('react/addons');

var Carousel = React.createClass({
	propTypes: {},

	carousel: null,
	touchStart: null,
	touchPos: null,
	touchTime: null,
	touchSpeed: 0,
	carouselPos: 0,
	maxCarouselPos: 0,
	minCarouselPos: 0,

	getInitialState: function() {
		return {
			touched: false,
			width: null,
			initialized: false,
			activeItem: 0
		};
	},
	render: function() {
		var innerClasses, 
			items = [],
			dots = [];

		innerClasses = React.addons.classSet({
					'carousel-items': true,
					'touch-released': !this.state.touched,
					'initialized': this.state.initialized
				});

		this.props.children.forEach(function(child, index) {
			var style = {
				width: this.state.width,
				textAlign: 'center',
				display: 'inline-block'
			};
			items.push(<div style={style} ref={"item_"+index} className="carousel-item">{child}</div>);
			dots.push(<div 	className={"dot " + (index === this.state.activeItem ? "active":"")} 
							onClick={this.onDotClick.bind(this, index)}
							style={this.getDotStyles()}></div>);
		}, this);
		console.log(this.carouselHeight);
		return ( 
			<div className="carousel" style={this.getCarouselStyles()}>
				<div className="carousel-inner" style={this.getCarouselInnerStyles()}>
					<div 	ref="carouselItems" className={innerClasses} style={this.getCarouselItemStyles()}
							onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove}	onTouchEnd={this.onTouchEnd}> 
						{items}
					</div>
					<div className="dots">
						{dots}
					</div>
				</div>
			</div>
		);
	},

	componentDidMount: function() {
		this.initCarouselDimensions();
	},

	componentDidUpdate: function(prevProps, prevState) {
		// console.log(this.state.touched);
		// console.log(this.getDOMNode());
	},

	initCarouselDimensions: function() {
		this.carousel = this.refs.carouselItems.getDOMNode();
		this.carousel.style.width = this.getDOMNode().clientWidth * this.props.children.length + "px";
		this.minCarouselPos = -(this.getDOMNode().clientWidth * (this.props.children.length-1));
		this.carouselHeight = this.refs.item_0 ? this.refs.item_0.getDOMNode().clientHeight : 0;
		console.log(this.refs.item_0);
		this.setState({
			width: this.getDOMNode().clientWidth,
			initialized: true
		});
	},

	onTouchStart: function(event) {
		event.preventDefault();
		var touchobj = event.changedTouches[0];
		this.touchStart = parseInt(touchobj.pageX);
		this.touchPos = 0;
		this.setState({
			touched: true
		});
	},

	onTouchMove: function(event) {
		event.preventDefault();
		var touchobj = event.changedTouches[0],
			newTouchPos = parseInt(touchobj.pageX) - this.touchStart;

		this.touchTime = new Date();
		this.touchSpeed = newTouchPos - this.touchPos;
		this.touchPos = newTouchPos;
		this.carousel.style.webkitTransform = 'translate3d('+(this.carouselPos + (this.touchPos))+'px,0px,0px)';
	},

	onTouchEnd: function(event) {
		event.preventDefault();
		var touchobj = event.changedTouches[0];

		// detect swipe fling: show next carousel item
		if (Math.abs(this.touchSpeed) > 15) {
			this.carouselPos = this.carouselPos + (this.sign(this.touchPos) * this.state.width);
		} else {
			// normal swipe behaviour instead
			this.carouselPos = this.state.width * Math.round((this.carouselPos + (this.touchPos)) / this.state.width);
		}

		// check min and max carouselpos and correct currentpos if necessary
		if (this.carouselPos >= this.maxCarouselPos) {
			this.carouselPos = this.maxCarouselPos;
		} else if (this.carouselPos <= this.minCarouselPos) {
			this.carouselPos = this.minCarouselPos;
		}

		this.touchSpeed = 0;
		this.setState({
			touched: false,
			activeItem: Math.abs(this.carouselPos / this.state.width)
		});
		this.carousel.style.webkitTransform = 'translate3d('+this.carouselPos+'px,0px,0px)';
	},

	onDotClick: function(index) {
		console.log(index);
	},

	sign: function(x) {
		return x > 0 ? 1 : x < 0 ? - 1 : x;
	},

	getCarouselItemStyles: function() {
		var transitionType = !this.state.touched ? 'all 200ms ease-out':'';
		return 	{
					opacity: this.state.initialized ? '1':'0',
					height: '100%',
					mozTransition: transitionType,
					oTransition: transitionType,
					WebkitTransition: transitionType,
					msTransition: transitionType,
					transition: transitionType,
				};
	},

	getCarouselInnerStyles: function() {
		return {
				position: 'absolute',
				top: '0',
				bottom: '0',
				left: '0',
				right: '0',
				overflow: 'initial'
			};
	},

	getCarouselStyles: function() {
		return {
					whiteSpace: 'nowrap',
					position: 'relative',
					width: '100%',
					textAlign: 'left',
				};
	},

	getDotStyles: function() {
		return {
			width: '10px',
			height: '10px',
			border: '1px solid black',
			borderRadius: '50%',
			display: 'inline-block',
			margin: '5px'
		}
	}
});

module.exports = Carousel;