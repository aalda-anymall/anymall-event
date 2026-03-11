"use client";

type ConfirmSubmitButtonProps = {
  className?: string;
  confirmMessage?: string;
  children: string;
};

export function ConfirmSubmitButton({
  className,
  confirmMessage = "Are you sure you want to delete this record?",
  children
}: ConfirmSubmitButtonProps) {
  return (
    <button
      className={className}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      type="submit"
    >
      {children}
    </button>
  );
}

