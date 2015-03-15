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
			initialized: false
		};
	},
	render: function() {

		var carouselStyles = {
			whiteSpace: 'nowrap',
			position: 'relative',
			width: '100%',
			textAlign: 'left',

		};
		var innerStyles = {
			position: 'absolute',
			top: '0',
			bottom: '0',
			left: '0',
			right: '0',
			overflow: 'initial'
		};
		var transitionType = !this.state.touched ? 'all 200ms ease-out':'';
		var itemsStyles = {
			opacity: this.state.initialized ? '1':'0',
			height: '100%',
			mozTransition: transitionType,
  			oTransition: transitionType,
  			WebkitTransition: transitionType,
  			msTransition: transitionType,
  			transition: transitionType,
		};
		var innerClasses = React.addons.classSet({
						'carousel-items': true,
						'touch-released': !this.state.touched,
						'initialized': this.state.initialized
		  			});
		return ( 
			<div className="carousel" style={carouselStyles}>
				<div className="carousel-inner" style={innerStyles}>
					<div 	ref="carouselItems" className={innerClasses} style={itemsStyles}
							onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove}	onTouchEnd={this.onTouchEnd}> 
						{
							this.props.children.map(function(child) {
								var style = {
									width: this.state.width,
									textAlign: 'center',
									display: 'inline-block'
								};
								return <div style={style} className="carousel-item">{child}</div>;
							}, this)
						}
						
					</div>
				</div>
			</div>
		);
	},

	componentDidMount: function() {
		this.initCarouselDimensions();
	},

	componentDidUpdate: function(prevProps, prevState) {
		console.log(this.state.touched);
		console.log(this.getDOMNode());
	},

	initCarouselDimensions: function() {
		this.carousel = this.refs.carouselItems.getDOMNode();
		this.carousel.style.width = this.getDOMNode().clientWidth * this.props.children.length + "px";
		this.minCarouselPos = -(this.getDOMNode().clientWidth * (this.props.children.length-1));
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
		this.carousel.style.webkitTransform = 'translate3d('+(this.carouselPos + (this.touchPos*2))+'px,0px,0px)';
	},

	onTouchEnd: function(event) {
		event.preventDefault();
		var touchobj = event.changedTouches[0];

		this.carouselPos = this.state.width * Math.round((this.carouselPos + (this.touchPos*2)) / this.state.width);
		if (Math.abs(this.touchSpeed) > 30) {
			this.carouselPos = this.state.width * Math.round((this.carouselPos + (this.touchPos*1.2)) / this.state.width);
		}

		// check min and max carouselpos and correct currentpos if necessary
		if (this.carouselPos >= this.maxCarouselPos) {
			this.carouselPos = this.maxCarouselPos;
		} else if (this.carouselPos <= this.minCarouselPos) {
			this.carouselPos = this.minCarouselPos;
		}

		this.touchSpeed = 0;
		this.setState({
			touched: false
		});
		this.carousel.style.webkitTransform = 'translate3d('+this.carouselPos+'px,0px,0px)';
	}
});

module.exports = Carousel;