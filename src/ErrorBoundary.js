import React from "react";
import errorImage from "./assets/img/undraw_bug_fixing.svg";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: "", errorInfo: "" };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //  logErrorToMyService(error, errorInfo);
    console.log(errorInfo);
    this.state.error = error;
    this.state.errorInfo = errorInfo;
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      const tmp = this.state.errorInfo;
      return (
        <div className="error">
          <h1 style={{ margin: "2em" }}>Something went wrong.</h1>
          <div>{String(this.state.error)}</div>
          <p />
          <div className="errorBoundary">
            <code>{JSON.stringify(tmp, null, 2)}</code>
          </div>
          <img src={errorImage} alt="Error" height={600} />
        </div>
      );
    }

    return this.props.children;
  }
}
