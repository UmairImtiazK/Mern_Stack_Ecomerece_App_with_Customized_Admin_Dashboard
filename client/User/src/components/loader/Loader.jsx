import { useState } from "react";
import HashLoader from "react-spinners/HashLoader";

// Override styles to ensure loader is centered
const override = {
  display: "block",
  margin: "0 auto",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)", // Centers the loader
};

function Loader() {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ position: "relative", height: "100vh" }}> {/* Full-screen container */}
      <HashLoader
        color="#007bff" // A beautiful blue color
        loading={loading}
        cssOverride={override}
        size={100} // Adjust size as per preference
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loader;
