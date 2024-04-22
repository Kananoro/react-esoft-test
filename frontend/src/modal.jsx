import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	const handleClickOutside = (event) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	return ReactDOM.createPortal(
		<div
			onClick={handleClickOutside}
			className="w-full h-full fixed top-0 left-0 z-[9999] bg-[rgb(0,0,0,0.25)] flex justify-center items-center">
			<div className="w-[600px] h-[500px] rounded-2xl bg-white relative flex flex-col justify-center items-center">
				<button className="absolute top-2 right-4" onClick={onClose}>
					Close
				</button>
				{children}
			</div>
		</div>,
		document.getElementById("modal"),
	);
};

export default Modal;
