"use client";
import React, { useEffect, useRef } from "react";
import { Textarea } from "./ui/textarea";

interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const AutoGrowTextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ ...props }, ref) => {
		const textAreaRef = useRef<HTMLTextAreaElement>(null);

		const resizeTextArea = () => {
			if (textAreaRef.current) {
				textAreaRef.current.style.height = "auto";
				textAreaRef.current.style.height =
					textAreaRef.current?.scrollHeight + "px";
			}
		};

		useEffect(resizeTextArea, [props.value]);

		return (
			<Textarea ref={textAreaRef} {...props} onInput={resizeTextArea} />
		);
	}
);

AutoGrowTextArea.displayName = "AutoGrowTextArea";

export default AutoGrowTextArea;
