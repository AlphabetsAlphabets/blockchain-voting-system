interface props {
  children: string;
  typeofButton: string;
  onClickButton: (buttonName: string) => void;
}

function Button({ children, typeofButton, onClickButton }: props) {
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

export default Button;
