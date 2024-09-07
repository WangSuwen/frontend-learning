export default function useContextMenu(containerRef, listener = true) {
	let x, y, showMenu;
	const handleContextMenu = (e) => {
		e.preventDefault();
		e.stopPropagation();
		x = e.clientX;
		y = e.clientY;
		showMenu = true;
		return {
			x,
			y,
			showMenu
		};
	};
	if (listener) {
		containerRef.addEventListener('contextmenu', handleContextMenu);
	} else {
		console.log('listener false');
		containerRef.removeEventListener('contextmenu', handleContextMenu);
	}
}