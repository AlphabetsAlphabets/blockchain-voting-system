interface props {
  children: string;
  typeofButton: string;
  onClickButton: (buttonName: string) => void;
}

function CustomButton({ children, typeofButton, onClickButton }: props) {
  return (
    <button
      type="button"
      className={'btn btn-' + typeofButton}
      onClick={() => onClickButton(children)}
    >
      {children}
    </button>
  );
}

export default CustomButton;
