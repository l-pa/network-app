import React from "react";
import errorImage from "./assets/img/undraw_bug_fixing.svg";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //  logErrorToMyService(error, errorInfo);
    console.log(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error">
          <h1 style={{ margin: "2em" }}>Something went wrong.</h1>
          <img src={errorImage} alt="Error" height={600} />
          <h3>{this.state.error}</h3>
        </div>
      );
    }

    return this.props.children;
  }
}
