import type { ButtonHTMLAttributes, ReactNode } from "react";

type GradientButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    fullWidth?: boolean;
};

export function GradientButton({
    children,
    className,
    fullWidth = false,
    ...props
}: GradientButtonProps) {
    const classes = ["gradient-button"];

    if (fullWidth) {
        classes.push("gradient-button--full");
    }

    if (className) {
        classes.push(className);
    }

    return (
        <button {...props} className={classes.join(" ")}>
            {children}
        </button>
    );
}
