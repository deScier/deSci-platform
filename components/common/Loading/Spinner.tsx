import "@styles/loading.css";
/**
 * @title Spinner Component
 * @notice This component renders a spinning loader.
 * @dev Spinner component used to show a loading state in the UI. The component
 * can be customized with different colors, sizes, and border widths.
 */
const Spinner = ({ color = "white", size = "24px", borderWidth = "3px" }) => {
  /** @dev Style object for the spinner, derived from props. */
  const style = {
    width: size,
    height: size,
    borderWidth: borderWidth,
  };

  /**
   * @return Returns a span element with the spinner class and dynamic styling.
   * @dev Renders the spinner with the provided style attributes.
   */
  return <span className="spinner" style={style}></span>;
};

export default Spinner;
