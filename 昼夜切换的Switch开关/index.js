function createSwitch(elementId, option) {
	const ele = document.getElementById(elementId);
	ele.classList.add(option.checked ? 'on' : 'off');

	ele.addEventListener('click', function (e) {
		const el = e.currentTarget;
		const classes = el.className.split(' ');
		if (classes.find((x) => x === 'off')) {
			el.classList.remove('off');
			el.classList.add('on');
		} else {
			el.classList.remove('on');
			el.classList.add('off');
		}
	});

	if (option.autoplay) {
		setInterval(function () {
			ele.click();
		}, option.interval || 3000);
	}
}

createSwitch('my_switch', { checked: true, autoplay: false });
