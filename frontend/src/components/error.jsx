import React from "react";

const ErrorCard = ({ error }) => {
	return (
		<div
			className={`${
				error ? "" : "hidden"
			} w-[400px] border absolute bottom-16 rounded-2xl bg-red-600 text-center`}>
			{error}
		</div>
	);
};

export default ErrorCard;
