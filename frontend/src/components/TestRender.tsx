const TestRender = () => {
  console.log("✅ TestRender se está montando");

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        color: "white",
        backgroundColor: "green",
        fontSize: "2rem",
        borderRadius: "8px",
        marginTop: "4rem",
      }}
    >
      ✅ React está funcionando
    </div>
  );
};

export default TestRender;
